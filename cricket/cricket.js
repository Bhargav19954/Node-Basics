"use strict"
const chalk = require('chalk');
const { getOver, decreaseOver, calculateChaseOvers, calculateNRR, calculateRestrictRuns, calcOver } = require('./functions')

const point_table1 = [
    {
        team: "Vikings XI",
        matches: 7,
        won: 5,
        lost: 2,
        nrr: 0.771,
        for_runs: 1130,
        for_overs: 133.1,
        against_runs: 1071,
        against_overs: 138.5,
        pts: 10
    },
    {
        team: "BHAYANKAR XI",
        matches: 7,
        won: 4,
        lost: 3,
        nrr: 0.597,
        for_runs: 1217,
        for_overs: 140,
        against_runs: 1066,
        against_overs: 131.4,
        pts: 8
    },
    {
        team: "RAGNAROK STARS",
        matches: 7,
        won: 4,
        lost: 3,
        nrr: 0.319,
        for_runs: 1085,
        for_overs: 126,
        against_runs: 1136,
        against_overs: 137,
        pts: 8
    },
    {
        team: "Treacherous",
        matches: 7,
        won: 3,
        lost: 4,
        nrr: 0.331,
        for_runs: 1066,
        for_overs: 128.2,
        against_runs: 1094,
        against_overs: 137.1,
        pts: 6
    },
    {
        team: "Renegades XI",
        matches: 8,
        won: 2,
        lost: 6,
        nrr: -1.75,
        for_runs: 1003,
        for_overs: 155.2,
        against_runs: 1134,
        against_overs: 138.1,
        pts: 4
    }
]
const point_table_min = JSON.parse(JSON.stringify(point_table1));
const point_table_max = JSON.parse(JSON.stringify(point_table1));

/*
    your team = The team position in table which wants to move at any poistion i.e for Treacherous = 4

    opp_team = The team position in table against which our match is i.e RAGNAROK STARS. = 3 

    your_team_first = bat / bowl . whether your team is baating first or bowling first

    first_bat_run = First innings Runs by any team

    first_bat_over = Overs played by firt_inning

    target_position = position you want for your team after this match i.e 3.

*/

function prediction(your_team, opp_team, your_team_first, first_bat_run, first_bat_over, target_position) {
    if (your_team_first == 'bat') {
        // Minimum Run scenario
        let team1 = point_table_min[your_team - 1];
        let team2 = point_table_min[opp_team - 1];
        team1.pts += 2;
        team1.won += 1;
        team1.matches += 1;
        team2.matches += 1;
        team1.for_runs += first_bat_run;
        team1.for_overs += first_bat_over;
        team2.lost += 1;
        team2.against_runs += first_bat_run;
        team2.against_overs += first_bat_over;
        team1.against_overs += first_bat_over;
        team2.for_overs += first_bat_over;
        var runs = 0;
        do {
            team1.against_runs -= runs;
            team2.for_runs -= runs;
            team2.nrr = calculateNRR(team2);
            team1.nrr = calculateNRR(team1);
            if (team1.nrr < point_table_min[target_position - 2].nrr) {
                break;
            }
            runs++;
            team1.against_runs += runs;
            team2.for_runs += runs
            team2.nrr = calculateNRR(team2);
            team1.nrr = calculateNRR(team1);
        }
        while (team1.nrr >= point_table_min[target_position - 2].nrr);
        var min_runs = runs;
        console.log(chalk.blue("\nMin_runs " + min_runs + '\n'))
        let min_array = JSON.parse(JSON.stringify(point_table_min))
        min_array.sort((a, b) => (a.pts < b.pts) ? 1 : (a.pts === b.pts) ? ((a.nrr < b.nrr) ? 1 : -1) : -1)

        console.log(chalk.green("Point_table_min Runs :\n") + JSON.stringify(min_array, null, 2))


        // Re- assiggning opponent team runs for max run scenario check
        team1.against_runs -= runs;
        team2.for_runs -= runs;
        team1.nrr = calculateNRR(team1);
        team2.nrr = calculateNRR(team2);

        var max_runs = first_bat_run;
        do {
            max_runs -= 1;
            team1.against_runs += max_runs;
            team2.for_runs += max_runs;
            team1.nrr = calculateNRR(team1);
            team2.nrr = calculateNRR(team2);
            team1.against_runs -= max_runs;
            team2.for_runs -= max_runs;
        }
        while (team1.nrr > point_table_min[target_position - 2].nrr || team1.nrr < point_table_min[target_position - 1].nrr)
        point_table_min.sort((a, b) => (a.pts < b.pts) ? 1 : (a.pts === b.pts) ? ((a.nrr < b.nrr) ? 1 : -1) : -1)
        console.log(chalk.blue("\nMax_runs " + max_runs + '\n'))
        console.log(chalk.greenBright("Max_runs_ponits_table : \n ") + JSON.stringify(point_table_min, null, 2))
        return {
            Run_Range: { min_runs, max_runs }
        }
    }
    else {
        // Min overs scenario
        let max_nrr = point_table_min[target_position - 2].nrr;
        let team1 = point_table_min[your_team - 1];
        let team2 = point_table_min[opp_team - 1];

        // Your team
        team1.pts += 2;
        team1.won += 1;
        team1.matches += 1;
        team1.against_runs += first_bat_run;
        team1.against_overs += first_bat_over;
        team1.for_runs += first_bat_run + 1;

        // Opp. team
        team2.lost += 1;
        team2.matches += 1;
        team2.for_runs += first_bat_run;
        team2.for_overs += first_bat_over;
        team2.against_runs += first_bat_run + 1;
        let i = 0;
        let min_overs = 0;
        do {

            team1.for_overs = getOver(calcOver(team1.for_overs) - calcOver(min_overs));
            team2.against_overs = getOver(calcOver(team2.against_overs) - calcOver(min_overs));
            team1.nrr = calculateNRR(team1);
            team2.nrr = calculateNRR(team2);
            i = i + 0.001
            min_overs = calculateChaseOvers(team1, max_nrr - i);
            team1.for_overs = getOver(calcOver(team1.for_overs) + calcOver(min_overs));
            team2.against_overs = getOver(calcOver(team2.against_overs) + calcOver(min_overs));
            team1.nrr = calculateNRR(team1);
            team2.nrr = calculateNRR(team2);
            var bn = calculateNRR(team1);
        }
        while (bn >= point_table_min[target_position - 2].nrr);

        point_table_min.sort((a, b) => (a.pts < b.pts) ? 1 : (a.pts === b.pts) ? ((a.nrr < b.nrr) ? 1 : -1) : -1);

        console.log(chalk.blue("Min_overs " + min_overs + '\n'));
        console.log(chalk.green("Min_over_points_table : \n") + JSON.stringify(point_table_min, null, 2))

        team1 = point_table_max[your_team - 1];
        team2 = point_table_max[opp_team - 1];
        team1.pts += 2;
        team1.won += 1;
        team1.matches += 1;
        team2.matches += 1;
        team1.against_runs += first_bat_run;
        team1.against_overs += first_bat_over;
        team2.for_runs += first_bat_run;
        team2.for_overs += first_bat_over;
        team1.for_runs += first_bat_run + 1;;
        team2.lost += 1
        team2.against_runs += first_bat_run + 1;;
        let max_overs = first_bat_over + 0.1;
        do {
            max_overs = decreaseOver(max_overs)
            team1.for_overs = getOver(calcOver(team1.for_overs) + calcOver(max_overs));
            team2.against_overs = getOver(calcOver(team2.against_overs) + calcOver(max_overs));
            team1.nrr = calculateNRR(team1)
            team2.nrr = calculateNRR(team2)
            team1.for_overs = getOver(calcOver(team1.for_overs) - calcOver(max_overs));
            team2.against_overs = getOver(calcOver(team2.against_overs) - calcOver(max_overs));
        }
        while (team1.nrr < point_table_min[target_position - 1].nrr && team1.nrr > point_table_min[target_position - 2].nrr)
        team1.for_overs = getOver(calcOver(team1.for_overs) + calcOver(max_overs));
        team2.against_overs = getOver(calcOver(team2.against_overs) + calcOver(max_overs));
        team1.nrr = calculateNRR(team1)
        team2.nrr = calculateNRR(team2)
        point_table_max.sort((a, b) => (a.pts < b.pts) ? 1 : (a.pts === b.pts) ? ((a.nrr < b.nrr) ? 1 : -1) : -1);

        console.log(chalk.blue("\nMax_overs " + max_overs + '\n'));
        console.log(chalk.green("Max_over_points_table : \n") + JSON.stringify(point_table_max, null, 2));

        return {
            Over_range: { min_overs, max_overs }
        }
    }

}
/*
        Function call Example for different test case

        1a
        const result = prediction(4, 3, 'bat', 120, 20, 3);

        1b
        const result = prediction(4, 3, 'bowl', 119, 20, 3);

        2a
        const result = prediction(4, 2, 'bat', 80, 20, 3);

        2b
        const result = prediction(4, 2, 'bowl', 79, 20, 3);


        console.table(chalk.yellowBright(JSON.stringify(result, null, 2)))

*/





