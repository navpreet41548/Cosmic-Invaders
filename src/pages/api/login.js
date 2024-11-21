import User from "../../../models/User"; // Adjust the path to your User model
import dbConnect from "../../../utils/dbConnect";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();

    const { userId, username = "", referCode } = req.body;
    // let referCode = 'SBSS90B5'
    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    const now = new Date();

    let user = await User.findOne({ userId });

    if (user) {
      // Update defaults if necessary
      const updates = {};
      if (!user.powerUps || !user.powerUps.forceField || !user.powerUps.energyPulse) {
        updates.powerUps = { forceField: 10, energyPulse: 10 };
      }

      // Reset daily bonus if missed
      const lastCollectedBonus = user.dailyBonus.find((bonus) => bonus.collectedOn);
      if (lastCollectedBonus) {
        const timeSinceLastCollected =
          (now - new Date(lastCollectedBonus.collectedOn)) / (1000 * 60 * 60 * 24);
        if (timeSinceLastCollected >= 2) {
          updates.dailyBonus = user.dailyBonus.map((bonus, index) => ({
            ...bonus,
            collected: false,
            collectedOn: null,
            availableOn: new Date(now.getTime() + index * 24 * 60 * 60 * 1000),
          }));
        }
      }

      if (!user.referCode || user.referCode === "") {
        updates.referCode = generateReferCode();
      }

      const updatedUser = await User.findByIdAndUpdate(user._id, updates, { new: true });
      return res.status(200).json({ user: updatedUser });
    } else {
      // Create a new user
      const newUser = await createNewUser({ userId, username, referCode });
      return res.status(201).json({ user: newUser });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
}

// Helper function to set default powerUps if not present
function updateUserDefaults(user) {
  if (!user.powerUps || !user.powerUps.forceField || !user.powerUps.energyPulse) {
    user.powerUps = {
      forceField: 10,
      energyPulse: 10,
    };
  }
}

// Helper function to reset daily bonus if a day is missed
function resetDailyBonusIfMissed(user) {
  const now = new Date();

  const lastCollectedBonus = user.dailyBonus.find((bonus) => bonus.collectedOn);
  if (lastCollectedBonus) {
    const timeSinceLastCollected =
      (now - new Date(lastCollectedBonus.collectedOn)) / (1000 * 60 * 60 * 24);
    if (timeSinceLastCollected >= 2) {
      user.dailyBonus = user.dailyBonus.map((bonus, index) => ({
        ...bonus,
        collected: false,
        collectedOn: null,
        availableOn: new Date(now.getTime() + index * 24 * 60 * 60 * 1000),
      }));
    }
  } else {
    user.dailyBonus = user.dailyBonus.map((bonus, index) => ({
      ...bonus,
      collected: false,
      collectedOn: null,
      availableOn: new Date(now.getTime() + index * 24 * 60 * 60 * 1000),
    }));
  }
}

// Helper function to create default daily bonus
function createDefaultDailyBonus() {
  const defaultDailyBonus = [];
  for (let i = 1; i <= 30; i++) {
    const availableOn = new Date();
    availableOn.setDate(availableOn.getDate() + (i - 1));

    let reward;
    if (i === 7) {
      reward = "1 $Pro Coin";
    } else if (i === 14) {
      reward = "2 $Pro Coins";
    } else if (i === 30) {
      reward = "10 $Pro Coins";
    } else {
      reward = `${i * 5} Cosmic Token`;
    }

    defaultDailyBonus.push({
      day: i,
      reward,
      collected: false,
      availableOn,
    });
  }
  return defaultDailyBonus;
}

// Helper function to generate a new referral code
function generateReferCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Helper function to create a new user
async function createNewUser({ userId, username, referCode }) {
  const defaultDailyBonus = createDefaultDailyBonus();
  const newUser = new User({
    userId,
    username,
    powerUps: {
      forceField: 10,
      energyPulse: 10,
    },
    cosmicToken: referCode ? 2000 : 0,
    proCoin: 0,
    dailyBonus: defaultDailyBonus,
    referCode: generateReferCode(),
    invite: {
      isInvited: Boolean(referCode),
      invitedBy: "",
      rewarded: Boolean(referCode),
    },
    referredUser: [],
  });

  if (referCode) {
    const referredUser = await User.findOne({ referCode });
    if (referredUser) {
      referredUser.referredUser.push({ userId });
      await referredUser.save();
      newUser.invite.invitedBy = referredUser.userId;
    }
  }

  return newUser.save();
}
