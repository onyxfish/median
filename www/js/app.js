// Globals
var resizeSidebarEl = null;
var resizeMobileEl = null;
var resizeDesktopEl = null;
var resizeFluidEl = null;
var previewWrapperEl = null;

var headlineEl = null;
var subhedEl = null;
var footerEl = null;
var ticksYEl = null;
var csvEl = null;

var embedEl = null;

var pymParent = null;

/*
 * Setup editor and preview.
 */
var onWindowLoaded = function() {
    resizeSidebarEl = d3.select('#resize-sidebar');
    resizeMobileEl = d3.select('#resize-mobile');
    resizeDesktopEl = d3.select('#resize-desktop');
    resizeFluidEl = d3.select('#resize-fluid');
    previewWrapperEl = d3.select('#preview-wrapper');

    headlineEl = d3.select('#headline');
    subhedEl = d3.select('#subhed');
    footerEl = d3.select('#footer');
    ticksYEl = d3.select('#ticks-y');
    csvEl = d3.select('#csv');

    embedEl = d3.select('#embed');

    resizeSidebarEl.on('click', function() {
        previewWrapperEl.style.width = '180px';
        pymParent.sendWidth();

        window.location.hash = 'sidebar';
    });

    resizeMobileEl.on('click', function() {
        previewWrapperEl.style.width = '300px';
        pymParent.sendWidth();

        window.location.hash = 'mobile';
    });

    resizeDesktopEl.on('click', function() {
        previewWrapperEl.style.width = '730px';
        pymParent.sendWidth();

        window.location.hash = 'desktop';
    });

    resizeFluidEl.on('click', function() {
        previewWrapperEl.style.width = '100%';
        pymParent.sendWidth();

        window.location.hash = 'fluid';
    });

    if (window.location.hash == '#sidebar') {
        previewWrapperEl.style.width = '180px';
    } else if (window.location.hash == '#mobile') {
        previewWrapperEl.style.width = '300px';
    } else if (window.location.hash == '#desktop') {
        previewWrapperEl.style.width = '730px';
    } else if (window.location.hash == '#fluid') {
        previewWrapperEl.style.width = '100%';
    }

    pymParent = new pym.Parent('preview', 'graphic.html', {});
    pymParent.onMessage('ready', updateChart);

    var changers = [headlineEl, subhedEl, footerEl, ticksYEl, csvEl];

    for (var i = 0; i < changers.length; i++) {
        changers[i].on('change', updateChart);
    }
}

/*
 * Validate user input for chart parameters.
 */
var validate = function() {
    if (isNaN(parseInt(ticksYEl[0][0].value))) {
        return 'TicksY is not a number!';
    }

    if (!csvEl[0][0].value) {
        return 'No CSV data!';
    }
}

/*
 * Validate the chart inputs, rerender it and update the embed code.
 */
var updateChart = function() {
    var error = validate();

    if (error) {
        alert(error);
        return;
    }

    var configuration = {
        'COPY': {
            'labels': {
                'headline': headlineEl[0][0].value,
                'subhed': subhedEl[0][0].value,
                'footer': footerEl[0][0].value,
                'source': null,
                'credit': null
            }
        },
        'GRAPHIC_DATA': csvEl[0][0].value,
        'PARAMETERS': {
            'ticksY': parseInt(ticksYEl[0][0].value)
        }
    }

    pymParent.sendMessage('configure', JSON.stringify(configuration));

    generateEmbedCode(configuration);
}

/*
 * Generate new embed code for the current chart configuration.
 */
var generateEmbedCode = function(configuration) {
    embedEl.text(JST.embed({
        'slug': 'test-graphic',
        'configuration': configuration
    }))
}

window.onload = onWindowLoaded;
