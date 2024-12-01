import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Received request:', req.method);
  console.log('Request body:', req.body);

  if (req.method === 'POST') {
    const { signature } = req.body;

    // Validate the signature
    if (!signature) {
      console.log('No signature provided');
      return res.status(400).json({ success: false, message: 'Signature is required' });
    }

    try {
      // Simulate saving the signature (replace with actual logic)
      console.log('Signature received:', signature);

      // Respond with success
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error saving signature:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
