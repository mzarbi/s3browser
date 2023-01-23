$(function(){

  // --- Demo GUI: ---------------------------------------------------
$("#optionsForm [name=cellFocus]").change(function(e) {
    var value = $(this).find(":selected").val();

    window.sessionStorage.setItem("cellFocus", value);
    $.ui.fancytree.getTree("#treegrid").setOption("ariagrid.cellFocus", value);
}).val(window.sessionStorage.getItem("cellFocus") || "allow");

var modelCount = 0;

// --- Fancytree widget --------------------------------------------

// var sourceUrl = getUrlParam("source");
// if( sourceUrl ){
//   sourceUrl = "https://cdn.jsdelivr.net/gh/mar10/assets@master/fancytree/" + sourceUrl;
// } else {
//   sourceUrl = "ajax-tree-products.json";
// }
// var sourceUrl = getUrlParam("source");
// var sourceUrl = "../test/ajax10k_nodes.json";
// var sourceUrl = "ajax10k_nodes.json";
var sourceUrl = "static/assets/json/data2.json";


$("#treetable").fancytree({
    extensions: ["clones", "dnd5", "edit", "filter", "grid", "ariagrid", "childcounter"],
    checkbox: true,
    quicksearch: true,
    autoScroll: true,
    debugLevel: 5,
    selectMode: 3,
    ariagrid: {
        // Internal behavior flags
        activateCellOnDoubelclick: true,
        cellFocus: $("#optionsForm [name=cellFocus]").find(":selected").val(),
        // TODO: use a global tree option `name` or `title` instead?:
        label: "Tree Grid", // Added as `aria-label` attribute
    },
    edit: {
        // triggerStart: ["f2", "mac+enter", "shift+click"],
    },
    childcounter: {
        deep: true,
        hideZeros: true,
        hideExpanded: true
    },
    filter: {
        autoExpand: true,
        highlight: true,
    },
    table: {
        indentation: 20, // indent 20px per node level
        nodeColumnIdx: 1, // render the node title into the 2nd column
        checkboxColumnIdx: 0, // render the checkboxes into the 1st column
    },
    viewport: {
        enabled: true,
        count: 15,
    },
    source: {
        url: sourceUrl,
        cache: false,
    },
    init: function(event, data) {
        modelCount = data.tree.count();
        $("#treetable caption").text("Loaded " + modelCount + " nodes.");
        data.tree.adjustViewportSize();
        // data.tree.addPagingNode();
    },
    lazyLoad: function(event, data) {
        data.result = {
            url: "ajax-sub2.json"
        }
    },
    activateCell: function(event, data) {
        data.node.debug(event.type, data);
    },
    defaultGridAction: function(event, data) {
        // Called when ENTER is pressed in cell-mode.
        data.node.debug(event.type, data);
    },
    renderColumns: function(event, data) {
        var node = data.node,
            $tdList = $(node.tr).find(">td");
        // (index #0 is rendered by fancytree by adding the checkbox)
        //$tdList.eq(1).text(node.getIndexHier());  //.addClass("alignRight");
        // (index #2 is rendered by fancytree)
        $tdList.eq(2).text(node.data.author);
        // $tdList.eq(3).text(node.data.qty);
        //$tdList.eq(4).html("<input type='checkbox' name='like' value='" + node.key + "'>");
    },
    updateViewport: function(event, data) {
        var tree = data.tree,
            topNode = tree.visibleNodeList[tree.viewport.start],
            path = (topNode && !topNode.isTopLevel()) ? topNode.getPath(false) + "/..." : "";

        tree.debug(event.type, data);

        // Display breadcrumb/parent-path in header
        tree.$container.find("thead th.parent-path").text(path);

        // Update edit controls
        if (!tree.isVpUpdating) {
            $("input#vpStart").val(tree.viewport.start);
            $("input#vpCount").val(tree.viewport.count);
            $("span.statistics").text(
                ", rows: " +
                (tree.visibleNodeList ? tree.visibleNodeList.length : "-") +
                "/" +
                modelCount
            );
        }
    },
});

$(window).on("resize", function(e) {
    // console.log(e.type, e);
    var tree = $.ui.fancytree.getTree();

    // Resize scroll wrapper to window height:
    // $wrapper.height(window.innerHeight - $wrapper[0].offsetTop - BOTTOM_OFS);
    // Re-calculate viewport.count from current wrapper height:
    tree.adjustViewportSize();
}).resize();

/* Handle inputs */
$(document).on("change", "#vpStart,#vpCount", function(e) {
    var tree = $.ui.fancytree.getTree(),
        opts = {
            start: $("#vpStart").val(),
            count: $("#vpCount").val(),
        };

    tree.setViewport(opts);
});

$("input[name=search]").on("keyup", function(e){
  var n,
    tree = $.ui.fancytree.getTree(),
    args = "autoApply autoExpand fuzzy hideExpanders highlight leavesOnly nodata".split(" "),
    opts = {},
    filterFunc = $("#branchMode").is(":checked") ? tree.filterBranches : tree.filterNodes,
    match = $(this).val();

  $.each(args, function(i, o) {
    opts[o] = $("#" + o).is(":checked");
  });
  opts.mode = $("#hideMode").is(":checked") ? "hide" : "dimm";

  if(e && e.which === $.ui.keyCode.ESCAPE || $.trim(match) === ""){
    $("button#btnResetSearch").trigger("click");
    return;
  }
  if($("#regex").is(":checked")) {
    // Pass function to perform match
    n = filterFunc.call(tree, function(node) {
      return new RegExp(match, "i").test(node.title);
    }, opts);
  } else {
    // Pass a string to perform case insensitive matching
    n = filterFunc.call(tree, match, opts);
  }
  $("button#btnResetSearch").attr("disabled", false);
  $("span#matches").text("(" + n + " matches)");
}).focus();


$("button#btnResetSearch").click(function(e){
  $("input[name=search]").val("");
  $("span#matches").text("");
  var tree = $.ui.fancytree.getTree();
  tree.clearFilter();
}).attr("disabled", true);

$("#expandAll").on("click", function(e) {
    $.ui.fancytree.getTree().expandAll();
});
$("#collapseAll").on("click", function(e) {
    $.ui.fancytree.getTree().expandAll(false);
});
$("#redraw").on("click", function(e) {
$.ui.fancytree.getTree().redrawViewport(true);
});

});