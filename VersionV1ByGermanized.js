const fnbr = require('fnbr');
const readline = require('readline');

const client = new fnbr.Client();
const approvedFriends = ['Friend3']; // Add specific friends' names if needed

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter your Fortnite authentication code: ', (linkAuthToken) => {
    client.login({ auth: linkAuthToken }).then(async () => {
        console.log('Logged in successfully');

        // Ensure party is initialized
        if (client.party) {
            // Set status
            client.setStatus('Free Lobbies by pronhubstar.lol Cousin Charges, We Don\'t!');
            console.log('Status set!');

            // Set outfit (CID_028_Athena_Commando_F example)
            await client.party.me.setOutfit('CID_028_Athena_Commando_F');
            console.log('Outfit set to CID_028_Athena_Commando_F');

            // Set emote (EID_KPopDance03 example)
            await client.party.me.setEmote('EID_KPopDance03');
            console.log('Emote set to EID_KPopDance03');
        } else {
            console.log('Party not initialized. Some features may not work.');
        }

        // Handle friend requests
        client.on('friendRequest', async (friendRequest) => {
            if (approvedFriends.includes(friendRequest.displayName)) {
                await friendRequest.accept();
                console.log(`Accepted friend request from ${friendRequest.displayName}`);
            }
        });

        // Auto accept party invites
        client.on('partyInvite', async (partyInvite) => {
            if (approvedFriends.includes(partyInvite.sender.displayName)) {
                await partyInvite.accept();
                console.log(`Accepted party invite from ${partyInvite.sender.displayName}`);
            }
        });

        // Send message when members join
        client.on('partyMemberJoin', async (member) => {
            if (member.id !== client.user.id) {
                await member.sendMessage(
                    "Yo! I hate paid stuff. Don't you? Cousin is a brokie. Visit pronhubstar.lol for free stuff. No broke mfs allowed."
                );
                console.log(`Sent DM to ${member.displayName}`);
            }
        });

        // Ready up when promoted
        client.on('partyMemberPromoted', async (member) => {
            if (member.id === client.user.id) {
                await client.party.me.readyUp();
                console.log('Bot ready up!');
            }
        });

        // Leave party after match starts
        client.on('partyMatchStart', async () => {
            await client.party.leave();
            console.log('Bot left the party to ensure bot lobby.');
        });

    }).catch(err => {
        console.error('Error logging in:', err);
    }).finally(() => {
        rl.close();
    });
});
