const sanityClient = require("@sanity/client");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const token =
    "sk7UG8flSLuWcu9mYWMG1MSZc3EvNWSCDDGKlDZhJPWTekwc0L0viRVhAgFvd1fKrLxGW85i0g9vCu96nnguwzkcTz1F7OEFCXAfDYdylOGPrTEHMULOF4Xh41GtYigPwvFfVfg1uQEzSSYXfOF2vKyTGIUvI63yvONF2Nhvc0VM5q4FWP1u";

const client = sanityClient({
    projectId: "5rziby0p",
    dataset: "production",
    useCdn: false,
    apiVersion: "2021-11-21",
    token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
});

async function CreateGolfer(req, res) {
    const { golfer, stripeSessionId } = req.body;
    const { status } = await stripe.checkout.sessions.retrieve(stripeSessionId);
    if (status === "complete") {
        const newGolfer = await client.create({ _type: "golfer", ...golfer });

        res.status(200).json({ golfer: newGolfer });
    } else {
        res.status(500).json({ error: "payment error" });
    }
}

export default CreateGolfer;
