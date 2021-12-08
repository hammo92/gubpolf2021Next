const sanityClient = require("@sanity/client");

const client = sanityClient({
    projectId: "5rziby0p",
    dataset: "production",
    useCdn: false,
    apiVersion: "2021-11-21",
    token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
});
const query = `*[_type == "golfer"]{
    _id,
    group
  }`;

async function addGolferToGroup(req, res) {
    const golfers = await client.fetch(query);
    const unassigned = golfers.filter((golfer) => golfer.group === null);
    if (!unassigned) {
        res.status(204);
    }
    const groups = [[], []];

    const inGroups = golfers
        .filter((golfer) => golfer.group !== null)
        .sort((a, b) => a?.group - b?.group);
    inGroups.forEach((golfer) => {
        if (golfer.group) {
            !groups[golfer.group] && groups.push([]);
            groups[golfer.group].push(golfer);
        }
    });
    const groupsOfFive = groups.filter((group) => group.length === 5);
    //if enough extra to make new group

    if (groupsOfFive.length + unassigned.length === 4) {
        console.log("enough to make new");
        const grabbedFromOtherGroups = groupsOfFive.map((group) => {
            return group[Math.floor(Math.random() * group.length)]._id;
        });
        console.log(`grabbedFromOtherGroups`, grabbedFromOtherGroups);
        const newGroupMembers = [unassigned[0]._id, ...grabbedFromOtherGroups];
        console.log(`newGoupMembers`, newGroupMembers);

        const transaction = client.transaction();
        newGroupMembers.map(async (golfer, index) => {
            transaction.patch(
                client.patch(golfer).set({ group: groups.length }),
            );
            //patch = patch.patch(golfer._id).set({ group: index });
        });
        const result = await transaction.commit();
        res.status(200).json({ result });
    } else {
        //if not enough to make new group
        unassigned.map(async (golfer) => {
            const groupsOfFourIndexes = groups
                .map((group, index) => {
                    if (group.length === 4) return index;
                    return null;
                })
                .filter((index) => index);

            const randomGroupOfFourIndex =
                groupsOfFourIndexes[
                    Math.floor(Math.random() * groupsOfFourIndexes.length)
                ];
            const result = await client
                .patch(golfer._id)
                .set({ group: randomGroupOfFourIndex })
                .commit();
            res.status(200).json({ result });
        });
    }
}

export default addGolferToGroup;
