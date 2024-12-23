import User from "../../../models/User"; // Adjust the path to your User model
import dbConnect from "../../../utils/dbConnect";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();

    const { userId, username = "", referCode } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    const now = new Date();

    // Upsert (update or insert) the user
    const user = await User.findOne({ userId });

    const updates = {};

    // Ensure powerUps are set or updated
    if (!user?.powerUps || Object.keys(user.powerUps).length === 0) {
      updates.powerUps = { forceField: 10, energyPulse: 10 };
    } else {
      updates["powerUps.forceField"] = 10;
      updates["powerUps.energyPulse"] = 10;
    }

    // Reset daily bonus if missed
    if (user) {
      const now = new Date();

      // Assuming user.dailyBonus is an array of 30 elements for the daily bonus streak
      const lastCollectedBonus = user.dailyBonus.find(bonus => bonus.collected);
      
      // Check if all bonuses have been collected
      const allCollected = user.dailyBonus.every(bonus => bonus.collected);
      
      if (allCollected) {
        // If all 30 days are collected, reset the daily streak
        user.dailyBonus.forEach((bonus, index) => {
          bonus.collected = false;
          bonus.collectedOn = null;
          bonus.availableOn = new Date(now.getTime() + index * 24 * 60 * 60 * 1000); // Reset available dates starting today
        });
      } else if (lastCollectedBonus) {
        // Calculate the time since the last bonus was collected
        const timeSinceLastCollected = (now - new Date(lastCollectedBonus.collectedOn)) / (1000 * 60 * 60 * 24);
      
        if (timeSinceLastCollected >= 2) {
          // If more than 1 day has passed since the last collection, reset the streak
          user.dailyBonus.forEach((bonus, index) => {
            bonus.collected = false;
            bonus.collectedOn = null;
            bonus.availableOn = new Date(now.getTime() + index * 24 * 60 * 60 * 1000);
          });
        }
      } else {
        // If no bonuses have been collected yet, initialize the availableOn dates
        user.dailyBonus.forEach((bonus, index) => {
          bonus.collected = false;
          bonus.collectedOn = null;
          bonus.availableOn = new Date(now.getTime() - 1000 + index * 24 * 60 * 60 * 1000);
        });
      }
      
    } else {
      updates.dailyBonus = createDefaultDailyBonus(now);
    }

    // Ensure referCode is set
    if (!user?.referCode || user.referCode === "") {
      updates.referCode = generateReferCode();
    }

    const updatedUser = await User.findOneAndUpdate(
      { userId },
      {
        $set: updates,
        $setOnInsert: {
          username,
          cosmicToken: referCode ? 2000 : 0,
          proCoin: 0,
          invite: {
            isInvited: Boolean(referCode),
            invitedBy: "",
            rewarded: Boolean(referCode),
          },
          referredUser: [],
        },
      },
      { new: true, upsert: true }
    );

    // Handle referral logic
    if (referCode && !user) {
      const referredUser = await User.findOne({ referCode });
      if (referredUser) {
        referredUser.referredUser.push({ userId });
        await referredUser.save();
      }
    }

    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
}

function generateReferCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 8 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

function createDefaultDailyBonus(now) {
  return Array.from({ length: 30 }, (_, i) => {
    const availableOn = new Date(now);
    availableOn.setDate(availableOn.getDate() + i);

    const reward =
      i === 6 ? "1 $Pro Coin" : i === 13 ? "2 $Pro Coins" : i === 29 ? "10 $Pro Coins" : `${(i + 1) * 5} Cosmic Token`;

    return {
      day: i + 1,
      reward,
      collected: false,
      availableOn,
    };
  });
}
