const { AutoPoster } = require('topgg-autoposter')

module.exports = (client) => {
    const TopGG = new AutoPoster(process.env.TOPGG, client);

    TopGG.on('posted', () => {
        console.log('posted to top.gg');
    });

    TopGG.on('error', (err) => {
        console.error(err);
    });
};