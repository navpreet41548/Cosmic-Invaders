import User from "../../../models/User"; // Adjust the path to your User model accordingly
import dbConnect from "../../../utils/dbConnect";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // await dbConnect(); // Connect to the database
  let { userId, username } = req.body;
  let referCode = req.body.referCode;
  if (!username) {
    username = "";
  }
  if (!userId) {
    return res
      .status(400)
      .json({ message: "UserId and Username are required" });
  }

  try {
    // Check if the user exists
    let user = await User.findOne({ userId });
    let referralMessage = "";

    if (user) {


      if(!user.powerUps.forceField || user.powerUps.energyPulse){
        user.powerUps = {
          forceField: 10,
          energyPulse: 10,
        }
      }
      const now = new Date();

      // Check if daily bonus was missed
      // 4. Check the daily bonus streak
      const lastCollectedBonus = user.dailyBonus.find(
        (bonus) => bonus.collectedOn
      );
      if (lastCollectedBonus) {
        const timeSinceLastCollected =
          (now - lastCollectedBonus.collectedOn) / (1000 * 60 * 60 * 24);
        if (timeSinceLastCollected >= 2) {
          // If more than 1 day has passed since last collection, reset the streak
          user.dailyBonus.forEach((bonus, index) => {
            bonus.collected = false;
            bonus.collectedOn = null;
            bonus.availableOn = new Date(
              now.getTime() + index * 24 * 60 * 60 * 1000
            );
          });
        }
      } else {
        user.dailyBonus.forEach((bonus, index) => {
          bonus.collected = false;
          bonus.collectedOn = null;

          // Decrease now.getTime() by 1 second (1000 milliseconds)
          bonus.availableOn = new Date(
            now.getTime() - 1000 + index * 24 * 60 * 60 * 1000
          );
        });
      }
      // User exists, return user data
      // Update seeds if 6 hours have passed
     

    

      if (!user.referCode || user.referCode == "") {
        user.referCode = generateReferCode();
      }

      // Save updated user data
      const updatedUser = await user.save();
      return res.status(200).json({ user: updatedUser });
    } else {
     
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

      // User does not exist, create new user with default location and empty holes
    
      let invitedBy = "";
      let referredUser 
      if (referCode) {
         referredUser = await User.findOne({ referCode });
        if (referredUser) {
          // referredUser.cosmicToken += 2000;
          referredUser.referredUser.push({ userId });
          await referredUser.save();
          invitedBy = referredUser.userId;
        } else {
          referCode = false;
        }
      }
      

      user = new User({
        userId,
        username,
        powerUps: {
          forceField: 10,
          energyPulse: 10,
          },
        cosmicToken:referCode? 2000: 0,
        proCoin: 0,
        dailyBonus: defaultDailyBonus,
        referCode: generateReferCode(),
        invite: {
          isInvited: referCode? true : false,
          invitedBy: referCode ? referredUser.userId : "",
          rewarded: referCode ? true : false,
        },
        referredUser: [],
      });

      let updatedUser = await user.save();

      return res.status(201).json({user: updatedUser});
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error });
  }
}


function generateReferCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
