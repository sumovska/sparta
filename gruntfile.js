module.exports = function(grunt) {

    /** Source paths **/
    var components = 'bower_components/';
    var src = {
        root: 'src/',
        less: 'src/less/',
        js: 'src/js/',
        img: 'src/img/',
        svg: 'src/svg/',
        favicon: 'src/favicon/',
        fonts: 'src/fonts/',
    };

    /** Temp paths **/
    var temp = {
        root: 'temp/',
        css: 'temp/css/',
        js: 'temp/js/',
        img: 'temp/img/',
        svg: 'temp/svg/',
        favicon: 'temp/favicon/',
    };

    /** Destination paths **/
    var dist = {
        root: 'dist/',
        css: 'dist/css/',
        js: 'dist/js/',
        img: 'dist/img/',
        svg: 'dist/svg/',
        favicon: 'dist/favicon/',
        fonts: 'dist/fonts/',
    };


    grunt.initConfig({

        // Config
        config: {
            src: 'src/',
            temp: 'temp/',
            dist: 'dist/'
        },

        // Delete files
        clean: {
            all: ['**/.DS_Store', temp.root, dist.root],
            temp: [temp.root],
            js: [temp.js, dist.js],
            css: [temp.css, dist.css],
            img: [temp.img, dist.img],
            svg: [temp.svg, dist.svg],
            favicon: [src.favicon + '**/*.*', '!<%= config.src %>/favicon/master.png', dist.favicon]
        },

        // Copy files
        copy: {
            static: {
                files: [{
                    expand: true,
                    cwd: src.root,
                    dest: dist.root,
                    src: [
                        'fonts/{,*/}*.*',
                        'audio/{,*/}*.*',
                        'video/{,*/}*.*',
                        '{,*/}*.html'
                    ]
                }]
            },
            js_temp: {
                files: [{
                    expand: true,
                    cwd: src.js,
                    src: 'main.js',
                    dest: temp.js
                }, {
                    expand: true,
                    flatten: true,
                    src: [
                        components + 'jquery/dist/jquery.min.js',
                        components + 'jquery/dist/jquery.min.map',
                        components + 'fastclick/lib/fastclick.js',
                        components + 'slick-carousel/slick/slick.min.js',
                        components + 'magnific-popup/dist/jquery.magnific-popup.min.js',
                        components + 'jquery-mask-plugin/dist/jquery.mask.min.js'
                    ],
                    dest: temp.js + 'vendor'
                }]
            },
            js_dist: {
                files: [{
                    expand: true,
                    cwd: temp.js,
                    src: '*.js',
                    dest: dist.js
                }, {
                    expand: true,
                    cwd: temp.js + 'vendor',
                    src: '*.min.*',
                    dest: dist.js + 'vendor',
                }]
            },
            css_temp: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: [
                        components + 'normalize-css/normalize.css',
                        components + 'slick-carousel/slick/slick.css',
                        components + 'magnific-popup/dist/magnific-popup.css'
                    ],
                    dest: temp.css + 'vendor'
                }]
            },
            css_dist: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: [temp.css + 'normalize.css', temp.css + 'plugins.css'],
                    dest: dist.css
                }, {
                    expand: true,
                    flatten: true,
                    src: temp.css + 'vendor/*.min.css',
                    dest: dist.css + 'vendor'
                }]
            },
            img_temp: {
                files: [{
                    expand: true,
                    cwd: src.img,
                    src: ['**/*.{png,jpg,gif}'],
                    dest: temp.img
                }]
            },
            img_dist: {
                files: [{
                    expand: true,
                    cwd: temp.img,
                    src: ['**/*.{png,jpg,gif}'],
                    dest: dist.img
                }]
            },
            svg_temp: {
                files: [{
                    expand: true,
                    cwd: src.svg,
                    src: ['**/*.svg'],
                    dest: temp.svg
                }]
            },
            svg_dist: {
                files: [{
                    expand: true,
                    cwd: temp.svg,
                    src: ['**/*.svg', '!sprite/*.svg'],
                    dest: dist.svg
                }]
            },
            favicon: {
                files: [{
                    expand: true,
                    cwd: src.favicon,
                    src: ['**/*.*', '!master.png'],
                    dest: dist.favicon
                }]
            },
        },

        // Minify CSS
        cssmin: {
            default: {
                files: [{
                    expand: true,
                    cwd: temp.css + 'vendor',
                    src: ['*.css', '!normalize.css'],
                    dest: temp.css + 'vendor',
                    ext: '.min.css'
                }, {
                    expand: true,
                    cwd: temp.css + 'vendor',
                    src: 'normalize.css',
                    dest: temp.css,
                    ext: '.css'
                }]
            }
        },

        // Minify JS
        uglify: {
            options: {
                preserveComments: false
            },
            default: {
                files: [{
                    expand: true,
                    cwd: temp.js + 'vendor',
                    src: ['*.js', '!*.min.js'],
                    dest: temp.js + 'vendor',
                    ext: '.min.js'
                }]
            }
        },

        // Concat files
        concat: {
            options: {
                separator: '\n\n'
            },
            css: {
                files: [{
                    src: temp.css + 'vendor/*.min.css',
                    dest: temp.css + 'plugins.css'
                }]
            },
            js: {
                files: [{
                    src: [
                        src.js + 'plugins.js',
                        temp.js + 'vendor/*.min.js',
                        '!' + temp.js + 'vendor/jquery.min.js'
                    ],
                    dest: temp.js + 'plugins.js'
                }]
            }
        },

        // Parse LESS
        less: {
            default: {
                files: [{
                    expand: true,
                    cwd: src.less,
                    src: ['main.less'],
                    dest: temp.css,
                    ext: ".css"
                }]
            }
        },

        // Post CSS
        postcss: {
            options: {
                map: {
                    inline: false,
                    annotation: dist.css + '/maps/'
                },
                processors: [
                    require('postcss-focus'),
                    require('postcss-flexbugs-fixes'),
                    require('autoprefixer')({
                        browsers: ['> 1%', 'last 2 versions', 'ie > 7']
                    }),
                    require('css-mqpacker')({
                        sort: true
                    })
                ]
            },
            default: {
                files: [{
                    expand: true,
                    cwd: temp.css,
                    src: ['main.css'],
                    dest: dist.css
                }]
            }
        },

        // Compress PNG (PNGquant)
        pngquant: {
            default: {
                files: [{
                    expand: true,
                    cwd: temp.img,
                    src: ['**/*.png'],
                    dest: temp.img
                }]
            },
            favicon: {
                files: [{
                    expand: true,
                    cwd: src.favicon,
                    src: ['**/*.png', '!master.png'],
                    dest: src.favicon
                }]
            }
        },

        // Compress SVG (SVGO)
        svgo: {
            default: {
                files: [{
                    expand: true,
                    cwd: temp.svg,
                    src: ['**/*.svg'],
                    dest: temp.svg
                }]
            },
            favicon: {
                files: [{
                    expand: true,
                    cwd: src.favicon,
                    src: ['**/*.svg'],
                    dest: src.favicon
                }]
            }
        },

        // Generate SVG sprite
        svgstore: {
            options: {
                inheritviewbox: true,
                cleanup: true,
                includeTitleElement: false,
                formatting: {
                    indent_size: 4,
                    wrap_line_length: 0,
                    end_with_newline: true
                }
            },
            default: {
                files: {
                    '<%= config.temp %>svg/sprite.svg': ['<%= config.temp %>svg/sprite/*.svg']
                }
            },
        },

        // Generate Favicon
        realFavicon: {
            favicons: {
                src: src.favicon + 'master.png',
                dest: src.favicon,
                options: {
                    iconsPath: src.favicon,
                    html: [],
                    design: {
                        ios: {
                            pictureAspect: 'backgroundAndMargin',
                            backgroundColor: '#2a3356',
                            margin: '18%',
                            assets: {
                                ios6AndPriorIcons: false,
                                ios7AndLaterIcons: false,
                                precomposedIcons: false,
                                declareOnlyDefaultIcon: true
                            }
                        },
                        desktopBrowser: {},
                        windows: {
                            pictureAspect: 'whiteSilhouette',
                            backgroundColor: '#2a3356',
                            onConflict: 'override',
                            assets: {
                                windows80Ie10Tile: false,
                                windows10Ie11EdgeTiles: {
                                    small: false,
                                    medium: true,
                                    big: false,
                                    rectangle: false
                                }
                            }
                        },
                        androidChrome: {
                            pictureAspect: 'noChange',
                            themeColor: '#2a3356',
                            manifest: {
                                name: 'Prime',
                                display: 'standalone',
                                orientation: 'notSet',
                                onConflict: 'override',
                                declared: true
                            },
                            assets: {
                                legacyIcon: false,
                                lowResolutionIcons: false
                            }
                        },
                        safariPinnedTab: {
                            pictureAspect: 'silhouette',
                            themeColor: '#5bbad5'
                        }
                    },
                    settings: {
                        scalingAlgorithm: 'Mitchell',
                        errorOnImageTooSmall: false
                    }
                }
            }
        },

        // Watch for changed files
        watch: {
            options: {
                livereload: true
            },
            static: {
                files: [src.root + "*.html"],
                tasks: ["static:process"]
            },
            css: {
                files: [src.less + "**/*.less"],
                tasks: ["css:process"]
            },
            js: {
                files: [src.js + "main.js"],
                tasks: ["js:process"]
            },
            img: {
                files: [src.img + "**/*.{png,jpg,gif}"],
                tasks: ["img:process"]
            },
            svg: {
                files: [src.svg + "**/*.svg"],
                tasks: ["svg:process"]
            }
        }
    });

    // npm tasks
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-newer");
    grunt.loadNpmTasks('grunt-pngquant');
    grunt.loadNpmTasks('grunt-svgo');
    grunt.loadNpmTasks('grunt-svgstore');
    grunt.loadNpmTasks('grunt-real-favicon');

    // Grunt tasks
    grunt.registerTask("default", ["clean:all", "start", "watch"]);
    grunt.registerTask("start", ["static:start", "css:start", "js:start", "img:start", "svg:start", "favicon:process", "clean:temp"]);

    grunt.registerTask("static", ["static:start"]);
    grunt.registerTask("static:start", ["copy:static"]);
    grunt.registerTask("static:process", ["newer:copy:static"]);

    grunt.registerTask("css", ["css:start"]);
    grunt.registerTask("css:start", ["clean:css", "copy:css_temp", "css:process", "cssmin:default", "concat:css", "copy:css_dist"]);
    grunt.registerTask("css:process", ["less:default", "postcss:default"]);

    grunt.registerTask("js", ["js:start"]);
    grunt.registerTask("js:start", ["clean:js", "copy:js_temp", "uglify:default", "concat:js", "copy:js_dist"]);
    grunt.registerTask("js:process", ["newer:copy:js_temp", "newer:copy:js_dist"]);

    grunt.registerTask("img", ["img:start"]);
    grunt.registerTask("img:start", ["clean:img", "copy:img_temp", "pngquant:default", "copy:img_dist"]);
    grunt.registerTask("img:process", ["newer:copy:img_temp", "newer:pngquant:default", "newer:copy:img_dist"]);

    grunt.registerTask("svg", ["svg:start"]);
    grunt.registerTask("svg:start", ["clean:svg", "copy:svg_temp", "svgo:default", "svgstore:default", "copy:svg_dist"]);
    grunt.registerTask("svg:process", ["newer:copy:svg_temp", "newer:svgo:default", "newer:copy:svg_dist"]);

    grunt.registerTask("favicon", ["favicon:start"]);
    grunt.registerTask("favicon:start", ["clean:favicon", "realFavicon", "svgo:favicon", "pngquant:favicon", "copy:favicon"]);
    grunt.registerTask("favicon:process", ["copy:favicon"]);
};
