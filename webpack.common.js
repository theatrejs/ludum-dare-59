const path = require('path');

const dotenv = require('dotenv');

dotenv.config();

/**
 * @returns {import('webpack').Configuration}
 */
function configuration() {

    return {

        'entry': path.resolve(__dirname, 'sources', 'index.js'),
        'experiments': {

            'topLevelAwait': true
        },
        'module': {

            'rules': [

                {
                    'test': /\.jpeg|\.jpg|\.m4a|\.mp3|\.png|\.wav$/,
                    'type': 'asset/resource'
                },
                {
                    'test': /\.aseprite$/,
                    'exclude': /\.font\.aseprite$/,
                    'use': [

                        {
                            'loader': '@theatrejs/loader-aseprite',
                            'options': {

                                'aseprite': process.env.ASEPRITE,
                                'constants': true,
                                'prepare': {

                                    'sheet': 'packed'
                                }
                            }
                        }
                    ]
                },
                {
                    'test': /\.font\.aseprite$/,
                    'use': [

                        {
                            'loader': '@theatrejs/loader-aseprite',
                            'options': {

                                'aseprite': process.env.ASEPRITE,
                                'prepare': {

                                    'sheet': 'packed',
                                    'trim': true
                                },
                                'processing': {

                                    'colorswap': [

                                        {
                                            'source': [255, 0, 255, 255],
                                            'target': [0, 0, 0, 0]
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                },
                {
                    'test': /\.ldtk$/,
                    'use': [

                        {
                            'loader': '@theatrejs/loader-ldtk',
                            'options': {

                                'constants': true
                            }
                        }
                    ]
                },
                {
                    'test': /\.rpp$/,
                    'use': [

                        {
                            'loader': '@theatrejs/loader-reaper',
                            'options': {

                                'reaper': process.env.REAPER
                            }
                        }
                    ]
                }
            ]
        },
        'output': {

            'path': path.resolve(__dirname, 'distribution', 'bundle'),
            'filename': 'bundle.js',
            'assetModuleFilename': '[hash][ext]'
        },
        'performance': {

            'hints': false
        },
        'resolve': {

            'alias': {

                'actors': path.resolve(__dirname, 'sources', 'actors'),
                'constants': path.resolve(__dirname, 'sources', 'constants'),
                'stages': path.resolve(__dirname, 'sources', 'stages'),
                'states': path.resolve(__dirname, 'sources', 'states')
            }
        },
        'stats': 'minimal'
    };
}

module.exports = configuration;
