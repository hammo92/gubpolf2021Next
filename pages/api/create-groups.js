const sanityClient = require("@sanity/client");

const client = sanityClient({
    projectId: "5rziby0p",
    dataset: "production",
    useCdn: false,
    apiVersion: "2021-11-21",
    token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
});

const query = `*[_type == "golfer"]{
    _id
  }`;

function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
}

function sliceIntoChunks(arr, chunkSize) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}

function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

async function CreateGolfer(req, res) {
    const golfers = await client.fetch(query);
    shuffle(golfers);
    let sliced = sliceIntoChunks(golfers, 4);
    if (sliced.at(-1).length < 4) {
        sliced.at(-1).map((golfer) => {
            const addToRandomGroup = () => {
                const randomGroup = randomIntFromInterval(0, sliced.length - 1);
                if (sliced[randomGroup].length === 4) {
                    sliced[randomGroup].push(golfer);
                } else {
                    addToRandomGroup();
                }
            };
            addToRandomGroup();
        });
        sliced.pop();
    }
    const transaction = client.transaction();
    sliced.map(async (group, index) => {
        //let patch = client;
        group.map(async (golfer) => {
            transaction.patch(
                client.patch(golfer._id).set({ group: index + 1 }),
            );
            //patch = patch.patch(golfer._id).set({ group: index });
        });

        //await client.commit();
    });
    const result = await transaction.commit();
    console.log(`result`, result);
    if (golfers) {
        res.status(200).json({ golfers });
    } else {
        res.status(500).json({ error: "messed up" });
    }
}

export default CreateGolfer;
