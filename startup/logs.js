module.exports = () => {
    
    process.on('uncaughtException', ex => { //catch any exception on node environment. synchrounous
        console.log(ex);
    });

    process.on('unhandledRejection', ex => { //catch any exception on node environment. asynchrounous
        console.log(ex);
    });
};
