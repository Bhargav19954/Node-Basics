
function getOver(over) {
    let temp = Math.floor(over);
    let remaining = over % temp;
    if (remaining > 0.833) {
        return temp + 0.5;
    }
    else if (remaining > 0.667) {
        return temp + 0.4
    }
    else if (remaining > 0.5) {
        return temp + 0.3
    }
    else if (remaining > 0.333) {
        return temp + 0.2
    }
    else {
        return temp + 0.1;
    }
}

function decreaseOver(over) {
    if (over % Math.floor(over) == 0) {
        return over - 0.5;
    }
    else {
        return (over - 0.1).toFixed(1);
    }
}

const splitOver = over => (over + "").split(".");
const makeFloat = str => parseFloat(str) || 0;

const calcOver = overStr => {
    /*
      calc nrr overs here
      (1): 0.167 (2): 0.333 (3): 0.500 (4): 0.667 (5): 0.833
    */
    const over = Number(splitOver(overStr)[0]);
    const balls = Number(splitOver(overStr)[1]);
    const ballsCalculated =
        balls > 0 ? (balls / 6).toFixed(3) : balls;
    return over + makeFloat(ballsCalculated);
};

function calculateNRR(team) {
    return ((team.for_runs / calcOver(team.for_overs)) - (team.against_runs / calcOver(team.against_overs))).toFixed(3)
}

function calculateRestrictRuns(team, required_nrr) {
    let runs = (((team.for_runs / calcOver(team.for_overs)) - required_nrr) * calcOver(team.against_overs)) - team.against_runs;
    return Math.round(runs)
}

function calculateChaseOvers(team, required_nrr) {
    let overs = ((team.for_runs) / ((team.against_runs / calcOver(team.against_overs)) + required_nrr)) - team.for_overs;
    return getOver(overs)
}


module.exports = {
    decreaseOver, getOver, calculateNRR,calculateChaseOvers,calculateRestrictRuns,calcOver
}
