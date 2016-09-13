"use strict"
const fs = require('fs');
const axios = require('axios')
const url = process.env.API_URL

function readFiles(dirname, onFileContent, onError) {
    fs.readdir(dirname, function(err, filenames) {
        if (err) {
            onError(err);
            return;
        }
        filenames.forEach(function(filename) {
            fs.readFile(dirname + filename, 'utf-8', function(err, content) {
                if (err) {
                    onError(err);
                    return;
                }
                // console.log('=========CONTENT',content);

                onFileContent(filename, content);
            });
        });
    });
}

let data = {};
readFiles('data/', function massageFiles(filename, content) {
    filename = filename.split('.')[0];
    data[filename] = JSON.parse(content);
    content = data[filename];

    axios.all([postATE(filename, content), postRPE(filename, content), postRephoto(filename, content), postCloud(filename, content)]).
    then(axios.spread(function(ate, rpe) {
        // console.log('ATE', ate)
        // console.log('RPE', rpe)
    })).catch(function(err) {
      console.log('OH NO!\n',err);
    })

}, function(err) {
    throw err;
});


const postATE = function(filename, content) {
    return axios.post(url + 'ate', {
        algorithm: findAlg(filename),
        dataset: findDataset(filename),
        value: toUnits(content.overall.ATE)
    })
}
const postRPE = function(filename, content) {
    return axios.post(url + 'rpe', {
        algorithm: findAlg(filename),
        dataset: findDataset(filename),
        value: toUnits(content.overall.RPE)
    })
}
const postRephoto = function(filename, content) {
    return axios.post(url + 'rephoto', {
        algorithm: findAlg(filename),
        dataset: findDataset(filename),
        value: toUnits(content.overall.RPE),
        percent: "0"
    })
}
const postCloud = function(filename, content) {
    return axios.post(url + 'cloud', {
        algorithm: findAlg(filename),
        dataset: findDataset(filename),
        val_1: "0",
        val_2: "0",
        val_3: "0",
        val_4: "0",
        val_5: "0",
        val_6: "0",
        val_7: "0",
        val_8: "0",
        val_9: "0",
        val_10: "0",

    })
}



function findAlg(filename) {
    const algList = {
        '1.11': [
            'ESUzp13y', 'YNyJp4Rx', '6XG1q80O', 'rADODkMQ', 'HNQHFZnE', 'PcYUK51Z', 'NZkslp9H'
        ],
        '1.12': [
            'Z31ccOzn', 'kxwBXPU5', '4XKTCJSP', 'SBM9Xdfr', 'p5iRPYEj', 'fmf6lZzQ', 'HXrY30lO'
        ],
        '1.13': [
            'O6cvcqxQ', 'cotdfZOF', '1QoDf1Gv', '5XWogh7u', 'Wgsc25XX', 'NaupS79n', 'rvmbGBrk'
        ],
        '1.14': [
            'm8gkdQum', 'uLFrYSH4', 'zrn6KXEK', '3OuGv1Cz', 'j4fljp2G', 'Ig6Vksp7', 'Bc5vssoX'
        ],
        '1.15': [
            'mwbwndBa', 'El71Li3d', 'FgBlcY5G', 'jgAtTEOv', 'trarT3QU', 'Wz3t2oH3', 'mETnOFgU'
        ]
    }
    if (algList['1.11'].indexOf(filename) > -1) {
        return '1.11'
    }
    if (algList['1.12'].indexOf(filename) > -1) {
        return '1.12'
    }
    if (algList['1.13'].indexOf(filename) > -1) {
        return '1.13'
    }
    if (algList['1.14'].indexOf(filename) > -1) {
        return '1.14'
    }
    if (algList['1.15'].indexOf(filename) > -1) {
        return '1.15'
    } else console.log('Error, alg version not found');
}

function findDataset(filename) {
    const datasetList = {
        'desk': [
            'ESUzp13y', 'Z31ccOzn', 'O6cvcqxQ', 'm8gkdQum', 'mwbwndBa'
        ],
        'room': [
            'YNyJp4Rx', 'kxwBXPU5', 'cotdfZOF', 'uLFrYSH4', 'El71Li3d'
        ],
        'flowerbo': [
            '6XG1q80O', '4XKTCJSP', '1QoDf1Gv', 'zrn6KXEK', 'FgBlcY5G'
        ],
        'longoffice': [
            'rADODkMQ', 'SBM9Xdfr', '5XWogh7u', '3OuGv1Cz', 'jgAtTEOv'
        ],
        '360': [
            'HNQHFZnE', 'p5iRPYEj', 'Wgsc25XX', 'j4fljp2G', 'trarT3QU'
        ],
        'icl0': [
            'PcYUK51Z', 'fmf6lZzQ', 'NaupS79n', 'Ig6Vksp7', 'Wz3t2oH3'
        ],
        'icl2': [
            'NZkslp9H', 'HXrY30lO', 'rvmbGBrk', 'Bc5vssoX', 'mETnOFgU'
        ]
    }
    if (datasetList.desk.indexOf(filename) > -1) {
        return 'desk'
    }
    if (datasetList.room.indexOf(filename) > -1) {
        return 'room'
    }
    if (datasetList.flowerbo.indexOf(filename) > -1) {
        return 'flowerbo'
    }
    if (datasetList.longoffice.indexOf(filename) > -1) {
        return 'longoffice'
    }
    if (datasetList['360'].indexOf(filename) > -1) {
        return '360'
    }
    if (datasetList.icl0.indexOf(filename) > -1) {
        return 'icl0'
    }
    if (datasetList.icl2.indexOf(filename) > -1) {
        return 'icl2'
    } else console.log('Error, could not find dataset name');

}

function toUnits(value) {
    return (value * 100).toFixed(2)
}
