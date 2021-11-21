const sanityClient = require("@sanity/client");

const token =
    "sk7UG8flSLuWcu9mYWMG1MSZc3EvNWSCDDGKlDZhJPWTekwc0L0viRVhAgFvd1fKrLxGW85i0g9vCu96nnguwzkcTz1F7OEFCXAfDYdylOGPrTEHMULOF4Xh41GtYigPwvFfVfg1uQEzSSYXfOF2vKyTGIUvI63yvONF2Nhvc0VM5q4FWP1u";

const client = sanityClient({
    projectId: "5rziby0p",
    dataset: "production",
    useCdn: false,
    apiVersion: "2021-11-21",
    token,
});

async function CreateGolfer(req, res) {
    const { golfer } = req.body;
    console.log(
        `process.env.SANITY_API_TOKEN,`,
        process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
    );
    const newGolfer = await client.create({ _type: "golfer", ...golfer });

    console.log(`newGolfer`, { _type: "golfer", name: "John Smith" });

    res.json({ golfer: newGolfer });
}

export default CreateGolfer;
