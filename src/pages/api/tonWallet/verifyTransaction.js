import { Cell, TonClient } from 'ton';

export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

  const { boc } = req.body;

  try {
    // Decode the BOC
    const cell = Cell.fromBoc(Buffer.from(boc, 'base64'))[0];
    
    // Extract transaction data (example assumes it's a simple transfer)
    const data = parseBOC(cell);

    if (data ) {
        console.log(data)
        return res.status(200).json({ msg: 'successfull transaction' });
    } else {
      return res.status(400).json({ error: 'Invalid transaction data' });
    }
  } catch (error) {
    console.error('Error decoding BOC:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

function parseBOC(cell) {
    try {
      const parser = cell.beginParse();
  
      // Safely parse recipient address
      let recipient = null;
      try {
        recipient = parser.loadAddress();
      } catch {
        console.warn('Recipient address not found or invalid');
      }
  
      // Safely parse sender address
      let sender = null;
      try {
        sender = parser.loadAddress();
      } catch {
        console.warn('Sender address not found or invalid');
      }
  
      // Parse amount (ensure it's handled safely)
      let amount = null;
      try {
        amount = parser.loadCoins();
      } catch {
        console.warn('Amount not found or invalid');
      }
  
      // Parse payload if available
      let payload = null;
      try {
        payload = parser.loadRef().beginParse().loadBits();
      } catch {
        console.warn('Payload not found or invalid');
      }
  
      return {
        isValid: true,
        recipient: recipient ? recipient.toString() : null,
        sender: sender ? sender.toString() : null,
        amount: amount ? amount.toString() : null,
        payload: payload ? payload.toString('hex') : null,
      };
    } catch (error) {
      console.error('Error parsing BOC:', error);
      return { isValid: false };
    }
  }
  
  
// Example DB function
async function updateUserReward(userId) {
  // MongoDB or other DB logic
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  user.rewards += 10; // Reward logic
  await user.save();
}