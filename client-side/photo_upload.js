function UPLOAD_PREVIEW(object_id) {
    this.canvas_id = "upload_photo_canvas";
    this.crop_path = {};
    this.image_crop = false;
    this.image_selected = false;
    this.object_id = object_id;
    this.paper_scope = {};
    this.resize_mouse_margin = 30;
    this.upload_image_raster;
    this.upload_photo = function (data_url) {};
    
    this.crop_mask_adjust = {
        left:   false,
        right:  false,
        top:    false,
        bottom: false,
        move:   false
    };
};

UPLOAD_PREVIEW.prototype.init = function(object_id) {
    this._build_objects(object_id);
    this.resize_canvas();
    
    var up_obj = this;
    paper.install(window);
    
    this.canvas = document.getElementById(this.canvas_id);
    this.object_id   = object_id;
    this.paper_scope = new paper.PaperScope();
    
    this.paper_scope.setup(this.canvas);
    paper = this.paper_scope;
    
    /* Add listeners */
    document.getElementById("input_upload_image").addEventListener("change", function(event) {
        up_obj.draw(up_obj, event);
    });
    
    document.getElementById("crop_photo_svg").addEventListener("click", function(event) {
        up_obj.crop_button(up_obj);
    });
    
    document.getElementById("photo_upload_ok_svg").addEventListener("click", function(event) {
        up_obj.ok_button();
    });
    
    document.getElementById("rotate_ccw_svg").addEventListener("click", function(event) {
        up_obj.rotate_ccw(up_obj);
    });

    document.getElementById("rotate_cw_svg").addEventListener("click", function(event) {
        up_obj.rotate_cw(up_obj);
    });
    
    $("#" + this.canvas_id).mouseup(function(event) {
        up_obj.upload_photo_mouse_up(up_obj.crop_path);
    });
}

UPLOAD_PREVIEW.prototype._build_objects = function(parent_object) {
    var html_code = "<div id='upload_photo_div'><canvas id='upload_photo_canvas'></canvas><div id='upload_photo_help'><div id='upload_photo_help_inner'></div></div></div><div id='upload_photo_footer'><div id='upload_photo_footer_left'><div id='upload_photo_tools'><div class='photo_upload_tool' id='rotate_ccw_div'></div><div class='photo_upload_tool' id='rotate_cw_div'></div><div class='photo_upload_tool' id='crop_photo_div'></div></div><div><input type='file' name='img' size='65' id='input_upload_image' /></div></div><div id='upload_photo_footer_right'></div></div>";
    
    var crop_svg_code = "<svg width='24' height='24' id='crop_photo_svg' class='upload_svg_icon_inactive' role='img' aria-label='Crop Photo'><title>Crop Photo</title><g transform='translate(0,-1028.3623)'><g transform='matrix(0.9610391,0,0,0.95932488,0.02098112,42.272408)'><path d='m 4.5000003,1038.1417 0,-9.7206 1.7253069,0 1.7253069,0 0,7.9952 0,7.9954 8.5002929,0 8.500292,0 0,1.7253 0,1.7253 -10.225599,0 -10.2255997,0 0,-9.7206 z' /><path transform='translate(0,1028.3623)' d='m 0.04524562,6.2919835 0,-1.7104718 1.71047178,0 1.7104717,0 0,1.7104718 0,1.7104717 -1.7104717,0 -1.71047178,0 0,-1.7104717 z' /><path transform='translate(0,1028.3623)' d='m 17.015808,11.524015 0,-3.5215598 -4.024639,0 -4.0246394,0 0,-1.7104717 0,-1.7104718 5.7351114,0 5.735111,0 0,5.2320312 0,5.2320311 -1.710472,0 -1.710472,0 0,-3.521559 z' /><path transform='translate(0,1028.3623)' d='m 17.015808,22.256386 0,-1.710471 1.710472,0 1.710472,0 0,1.710471 0,1.710472 -1.710472,0 -1.710472,0 0,-1.710472 z' /></g></g></svg>";
    
    var ok_svg_code = "<svg width='50' height='50' class='upload_svg_icon_inactive' id='photo_upload_ok_svg' role='img' aria-label='OK'><title>OK</title><g transform='matrix(0.51371618,0,0,0.51564698,-0.51380477,-0.45516914)'><path d='m 96.915,6.877 c -1.656,-1.52 -4.375,-1.536 -6.062,0 L 31.845,61.496 6.993,52.295 C 5.085,51.62 2.907,52.326 1.81,53.931 0.644,55.587 0.745,57.814 2.062,59.386 L 29.33,91.413 C 30.19,92.409 31.424,93 32.722,93 l 0.473,-0.019 c 1.216,-0.133 2.347,-0.758 3.073,-1.703 L 97.387,12.904 c 1.419,-1.823 1.217,-4.473 -0.472,-6.027 z m -64.193,84.636 0,0.019 0,0 0,-0.019 z' /></g></svg>"
    
    var rotate_ccw_svg_code = "<svg width='24' height='24' id='rotate_ccw_svg' class='upload_svg_icon_inactive' role='img' aria-label='Rotate Counterclockwise'><title>Rotate Counterclockwise</title><g transform='translate(0,-1028.3622)'><g transform='matrix(0.24444449,0,0,0.24444449,-0.22222835,795.34027)'><path d='m 94.90615,1008.808 c 0.341194,-3.081 -0.285137,-9.59132 -1.27719,-13.27554 l -0.539794,-2.00462 -3.952634,1.32895 c -2.980464,1.00211 -3.879175,1.52038 -3.653984,2.10724 0.696794,1.81581 1.435197,8.42527 1.224764,10.96287 l -0.227826,2.7473 2.004901,0.2927 c 1.102693,0.1609 2.922726,0.427 4.044524,0.5912 l 2.039623,0.2985 0.337616,-3.0486 z' /><path d='m 84.272605,1033.9284 c 3.603849,-3.989 8.121251,-11.6342 7.622435,-12.9001 -0.224953,-0.5709 -7.114409,-3.2839 -7.328347,-2.8858 -0.0558,0.1038 -0.690737,1.3662 -1.411001,2.8053 -0.720263,1.4391 -2.457419,4.1192 -3.860351,5.9557 l -2.550771,3.3392 2.852171,2.8522 2.85217,2.8521 1.823694,-2.0186 z' /><path d='m 62.187762,1046.5855 c 3.594722,-0.7793 9.429015,-2.9354 11.431002,-4.2245 l 1.201552,-0.7736 -1.673009,-2.9849 c -0.92016,-1.6417 -1.862607,-3.1981 -2.094322,-3.4587 -0.243455,-0.2737 -1.923984,0.196 -3.981073,1.1128 -1.957877,0.8726 -4.384805,1.7516 -5.393172,1.9534 -3.858474,0.772 -3.666792,0.5086 -3.666792,5.0383 0,2.2855 0.176788,4.1366 0.392874,4.1137 0.216075,-0.023 1.918393,-0.3723 3.78294,-0.7765 z' /><path d='m 85.9181,987.24022 3.548155,-1.98959 -1.383599,-2.05561 C 82.206742,974.46523 72.988948,968.04109 63.173073,965.83484 l -4.113472,-0.92456 0,-3.77403 0,-3.77402 -9.893389,5.86458 c -5.441357,3.22551 -9.979014,6.04953 -10.083692,6.27559 -0.104656,0.22606 4.347365,3.10084 9.89339,6.3884 l 10.083691,5.97738 0,-4.22043 0,-4.22043 1.921225,0.36042 c 7.172166,1.34551 15.164119,6.8483 20.356151,14.01601 l 1.032967,1.42606 3.548156,-1.98959 z' /><rect transform='matrix(-0.68544978,0.72811991,0.72811991,0.68544978,0,0)' y='696.78491' x='691.34351' height='52.719765' width='41.522648' /></g></g></svg>";
    
    var rotate_cw_svg_code = "<svg width='24' height='24' id='rotate_cw_svg' class='upload_svg_icon_inactive' role='img' aria-label='Rotate Clockwise'><title>Rotate Clockwise</title><g transform='translate(0,-1028.3622)'><g transform='matrix(0.24444445,0,0,0.24444445,-0.22222452,795.34031)'><path d='m 5.093854,1008.808 c -0.3411939,-3.081 0.2851372,-9.59132 1.2771903,-13.27554 l 0.5397932,-2.00462 3.9526345,1.32895 c 2.980464,1.00211 3.879175,1.52038 3.653984,2.10724 -0.696794,1.81581 -1.435197,8.42527 -1.224764,10.96287 l 0.227826,2.7473 -2.004901,0.2927 c -1.102693,0.1609 -2.9227261,0.427 -4.0445237,0.5912 l -2.0396235,0.2985 -0.3376158,-3.0486 z' /><path d='m 15.727399,1033.9284 c -3.603849,-3.989 -8.121251,-11.6342 -7.6224346,-12.9001 0.2249527,-0.5709 7.1144086,-3.2839 7.3283466,-2.8858 0.0558,0.1038 0.690737,1.3662 1.411001,2.8053 0.720263,1.4391 2.457419,4.1192 3.860351,5.9557 l 2.550771,3.3392 -2.852171,2.8522 -2.85217,2.8521 -1.823694,-2.0186 z' /><path d='m 37.812242,1046.5855 c -3.594722,-0.7793 -9.429015,-2.9354 -11.431002,-4.2245 l -1.201552,-0.7736 1.673009,-2.9849 c 0.92016,-1.6417 1.862607,-3.1981 2.094322,-3.4587 0.243455,-0.2737 1.923984,0.196 3.981073,1.1128 1.957877,0.8726 4.384805,1.7516 5.393172,1.9534 3.858474,0.772 3.666792,0.5086 3.666792,5.0383 0,2.2855 -0.176788,4.1366 -0.392874,4.1137 -0.216075,-0.023 -1.918393,-0.3723 -3.78294,-0.7765 z' /><path d='m 14.081904,987.24022 -3.548155,-1.98959 1.383599,-2.05561 c 5.875914,-8.72979 15.093708,-15.15393 24.909583,-17.36018 l 4.113472,-0.92456 0,-3.77403 0,-3.77402 9.893389,5.86458 c 5.441357,3.22551 9.979014,6.04953 10.083692,6.27559 0.104656,0.22606 -4.347365,3.10084 -9.89339,6.3884 l -10.083691,5.97738 0,-4.22043 0,-4.22043 -1.921225,0.36042 c -7.172166,1.34551 -15.164119,6.8483 -20.356151,14.01601 l -1.032967,1.42606 -3.548156,-1.98959 z' /><rect transform='matrix(0.68544978,0.72811991,-0.72811991,0.68544978,0,0)' y='623.9729' x='759.88849' height='52.719765' width='41.522648' /></g></g></svg>";
    
    $("#" + parent_object).html(html_code);
    $("#crop_photo_div").html(crop_svg_code);
    $("#upload_photo_footer_right").html(ok_svg_code);
    $("#rotate_ccw_div").html(rotate_ccw_svg_code);
    $("#rotate_cw_div").html(rotate_cw_svg_code);
}

UPLOAD_PREVIEW.prototype.cancel_crop  = function() {
    $("#crop_photo_svg").attr('class', 'upload_svg_icon');
    this.image_crop = false;
    this.crop_path.removeSegments();
    this.paper_scope.view.draw();
};

UPLOAD_PREVIEW.prototype.crop_button  = function(up_obj) {
    if (up_obj.image_crop === true) {
        up_obj.cancel_crop();
    } else {
        up_obj.start_photo_crop();
    }
};

UPLOAD_PREVIEW.prototype.draw  = function(up_obj, ev) {
    this.paper_scope.project.clear();
    
    var img = new Image();
    var f = document.getElementById("input_upload_image").files[0];
    var url = window.URL || window.webkitURL;
    var src = url.createObjectURL(f);
    var up_obj = this;
    
    this.upload_image_raster = new Raster(src);
    
    this.upload_image_raster.onLoad = function() {
        up_obj.resize_raster();
        up_obj.image_selected = true;
        
        $("#rotate_ccw_svg").attr('class', 'upload_svg_icon');
        $("#rotate_cw_svg").attr('class', 'upload_svg_icon');
        $("#crop_photo_svg").attr('class', 'upload_svg_icon');
        $("#photo_upload_ok_svg").attr('class', 'upload_svg_icon');
    };
};

UPLOAD_PREVIEW.prototype.resize_canvas  = function() {
    var new_width = $("#upload_photo_page_inner").width();
    var new_height = $(window).innerHeight() - 100;
    
    $("#" + this.canvas_id).css({'width': new_width});
    $("#" + this.canvas_id).css({'height': new_height});
    
    var photo_help_top = $("#upload_photo_footer").position().top - 110;
    $("#upload_photo_help").css({'top': photo_help_top});
};

UPLOAD_PREVIEW.prototype.resize_raster  = function() {
    this.upload_image_raster.position = this.paper_scope.view.center;
    this.paper_scope.view.zoom = 1;
    
    var photo_size = this.upload_image_raster.size;
    var view_size = this.paper_scope.view.size;
    var width_ratio  = view_size.width  / photo_size.width;
    var height_ratio = view_size.height / photo_size.height;
    var img_rotation = Math.abs(Math.round(this.upload_image_raster.rotation));
    var up_obj = this;
    
    if (img_rotation == 90 || img_rotation == 270) {
        if (width_ratio < height_ratio) {
            this.paper_scope.view.zoom = width_ratio;
        } else {
            this.paper_scope.view.zoom = height_ratio;
        }
        
        if (this.paper_scope.view.size.width < photo_size.height) {
            this.paper_scope.view.zoom = this.paper_scope.view.zoom * (this.paper_scope.view.size.width / photo_size.height);
        }
    } else {
        if (width_ratio < height_ratio) {
            this.paper_scope.view.zoom = width_ratio;
        } else {
            this.paper_scope.view.zoom = height_ratio;
        }
    }
    
    this.upload_image_raster.onMouseMove = function(event) {
        if (up_obj.image_crop === true) {
            up_obj.move_crop_mask(up_obj.crop_path, event);
        }
    }
    
    this.upload_image_raster.onMouseUp = function(event) {
        up_obj.upload_photo_mouse_up(up_obj.crop_path);
    }
    
    this.paper_scope.view.draw();
};

UPLOAD_PREVIEW.prototype.rotate_cw  = function(up_obj) {
    up_obj.upload_image_raster.rotate(90);

    if (typeof up_obj.crop_path.rotate != "undefined") {
        up_obj.crop_path.rotate(90);
    }

    up_obj.resize_raster();
};

UPLOAD_PREVIEW.prototype.rotate_ccw  = function(up_obj) {
    up_obj.upload_image_raster.rotate(-90);
    
    if (typeof up_obj.crop_path.rotate != "undefined") {
        up_obj.crop_path.rotate(-90);
    }
    
    up_obj.resize_raster();
};

UPLOAD_PREVIEW.prototype.ok_button  = function() {
    if (this.image_selected === true) {
        if (this.image_crop === false) {
            this.upload_photo_prep();
        } else {
            /* Crop Photo */
            var img_rotation = this.upload_image_raster.rotation;
        
            if (Math.abs(Math.round(img_rotation)) != 0) {
                var crop_x = this.crop_path.point_bounds.y1 - this.crop_path.image_bounds.top;
                var crop_y = this.crop_path.image_bounds.right - this.crop_path.point_bounds.x2;
                var crop_w = this.crop_path.bounds.height;
                var crop_h = this.crop_path.bounds.width;
            } else {
                var crop_x = this.crop_path.point_bounds.x1 - this.crop_path.image_bounds.left;
                var crop_y = this.crop_path.point_bounds.y1 - this.crop_path.image_bounds.top;
                var crop_w = this.crop_path.point_bounds.x2 - this.crop_path.point_bounds.x1;
                var crop_h = this.crop_path.point_bounds.y2 - this.crop_path.point_bounds.y1;
            }
            
            var crop_bounds = new Rectangle(crop_x, crop_y, crop_w, crop_h);
            var cropped_dataurl = this.upload_image_raster.getSubRaster(crop_bounds).toDataURL();
            
            this.paper_scope.project.clear();
            
            this.upload_image_raster = new Raster(cropped_dataurl);
            this.resize_raster();
            
            if (Math.abs(Math.round(img_rotation)) != 0) {
                this.upload_image_raster.rotate(img_rotation);
            }
            
            this.image_crop = false;
            $("#crop_photo_svg").attr('class', 'upload_svg_icon');
        }
    }
};

UPLOAD_PREVIEW.prototype.start_photo_crop  = function() {
    if (this.image_selected === true) {
        this.image_crop = true;
        $("#crop_photo_svg").attr('class', 'upload_svg_icon_selected');
    
        var img_rotation = Math.abs(Math.round(this.upload_image_raster.rotation));
        var photo_size = this.upload_image_raster.size;
        var crop_width = 0;
        var crop_height = 0;
        var up_obj = this;
        
        if (img_rotation == 90 || img_rotation == 270) {
            var crop_width = photo_size.height;
            var crop_height = photo_size.width;
            
            var point_bounds = {
                x1: this.paper_scope.view.center.x - (photo_size.height / 2),
                x2: this.paper_scope.view.center.x - (photo_size.height / 2) + photo_size.height,
                y1: this.paper_scope.view.center.y - (photo_size.width / 2),
                y2: this.paper_scope.view.center.y - (photo_size.width / 2) + photo_size.width
            };
        } else {
            var crop_width = photo_size.width;
            var crop_height = photo_size.height;
            
            var point_bounds = {
                x1: this.paper_scope.view.center.x - (photo_size.width / 2),
                x2: this.paper_scope.view.center.x - (photo_size.width / 2) + photo_size.width,
                y1: this.paper_scope.view.center.y - (photo_size.height / 2),
                y2: this.paper_scope.view.center.y - (photo_size.height / 2) + photo_size.height
            };
        }
        
        var crop_rectangle = new Rectangle(point_bounds.x1, point_bounds.y1, crop_width, crop_height);
        this.crop_path = new Path.Rectangle(crop_rectangle);

        this.crop_path.selectedColor = new Color(0.8, 0.8, 0.8, 0.7);
        this.crop_path.fillColor = new Color(0, 0, 0, 0);
        this.crop_path.strokeColor = new Color(0.8, 0.8, 0.8, 0.7);
        this.crop_path.strokeWidth = 20;
        
        this.crop_path.resize_click = false;
        this.crop_path.resize_click_start = {};
        this.crop_path.point_bounds = point_bounds;
        this.crop_path.image_bounds = {
            left:   point_bounds.x1,
            right:  point_bounds.x2,
            top:    point_bounds.y1,
            bottom: point_bounds.y2
        };
        
        /* Crop Path Mouse Events */
        this.crop_path.onMouseLeave = function(event) {
            $("#upload_photo_canvas").css('cursor', 'auto');
        }

        this.crop_path.onMouseMove = function(event) {
            var photo_size = up_obj.upload_image_raster.size;
            
            if (this.resize_click === false) {
                /* Reset crop mask move flags */
                up_obj.crop_mask_adjust.left = false;
                up_obj.crop_mask_adjust.right = false;
                up_obj.crop_mask_adjust.top = false;
                up_obj.crop_mask_adjust.bottom = false;
                up_obj.crop_mask_adjust.move = false;
                    
                if ( (event.point.y < this.point_bounds.y1 + up_obj.resize_mouse_margin) && (event.point.x < this.point_bounds.x1 + up_obj.resize_mouse_margin)) {
                    /* Top Left */
                    $("#upload_photo_canvas").css('cursor', 'nwse-resize');
                    up_obj.crop_mask_adjust.left = true;
                    up_obj.crop_mask_adjust.top = true;
                } else if ( (event.point.y < this.point_bounds.y1 + up_obj.resize_mouse_margin) && (event.point.x > this.point_bounds.x2 - up_obj.resize_mouse_margin)) {
                    /* Top Right */
                    $("#upload_photo_canvas").css('cursor', 'nesw-resize');
                    up_obj.crop_mask_adjust.right = true;
                    up_obj.crop_mask_adjust.top = true;
                } else if ( (event.point.y > this.point_bounds.y2 - up_obj.resize_mouse_margin) && (event.point.x < this.point_bounds.x1 + up_obj.resize_mouse_margin)) {
                    /* Bottom Left */
                    $("#upload_photo_canvas").css('cursor', 'nesw-resize');
                    up_obj.crop_mask_adjust.left = true;
                    up_obj.crop_mask_adjust.bottom = true;
                } else if ( (event.point.y > this.point_bounds.y2 - up_obj.resize_mouse_margin) && (event.point.x > this.point_bounds.x2 - up_obj.resize_mouse_margin)) {
                    /* Bottom Right */
                    $("#upload_photo_canvas").css('cursor', 'nwse-resize');
                    up_obj.crop_mask_adjust.right = true;
                    up_obj.crop_mask_adjust.bottom = true;
                } else if (event.point.y < this.point_bounds.y1 + up_obj.resize_mouse_margin) {
                    /* Top */
                    $("#upload_photo_canvas").css('cursor', 'row-resize');
                    up_obj.crop_mask_adjust.top = true;
                } else if (event.point.y > this.point_bounds.y2 - up_obj.esize_mouse_margin) {
                    /* Bottom */
                    $("#upload_photo_canvas").css('cursor', 'row-resize');
                    up_obj.crop_mask_adjust.bottom = true;
                } else if (event.point.x < this.point_bounds.x1 + up_obj.resize_mouse_margin) {
                    /* Left Side */
                    $("#upload_photo_canvas").css('cursor', 'col-resize');
                    up_obj.crop_mask_adjust.left = true;
                } else if (event.point.x > this.point_bounds.x2 - up_obj.resize_mouse_margin) {
                    /* Right Side */
                    $("#upload_photo_canvas").css('cursor', 'col-resize');
                    up_obj.crop_mask_adjust.right = true;
                } else {
                    $("#upload_photo_canvas").css('cursor', 'move');
                    up_obj.crop_mask_adjust.left = true;
                    up_obj.crop_mask_adjust.right = true;
                    up_obj.crop_mask_adjust.top = true;
                    up_obj.crop_mask_adjust.bottom = true;
                    up_obj.crop_mask_adjust.move = true;
                }
            } else {
                up_obj.move_crop_mask(this, event);
            }
        }

        this.crop_path.onMouseDown = function(event) {
            this.resize_click_start = event.point;
            this.resize_click = true;
        }

        this.crop_path.onMouseUp = function(event) {
            up_obj.upload_photo_mouse_up(this);
        }

        this.paper_scope.view.draw();
    }
};

UPLOAD_PREVIEW.prototype.move_crop_mask  = function(crop_path, event) {
    if (this.crop_path.resize_click === true) {
        if (this.crop_mask_adjust.left === true) {
            if (this.crop_mask_adjust.move === true && crop_path.point_bounds.x2 == crop_path.image_bounds.right) {
                /* Don't Shrink the mask */
            } else {
                crop_path.point_bounds.x1 = crop_path.bounds.left + (event.point.x - crop_path.resize_click_start.x);
            }
            
            if (crop_path.point_bounds.x1 < crop_path.image_bounds.left) {
                crop_path.point_bounds.x1 = crop_path.image_bounds.left;
            }
        }
        
        if (this.crop_mask_adjust.right === true) {
            if (this.crop_mask_adjust.move === true && crop_path.point_bounds.x1 == crop_path.image_bounds.left) {
                /* Don't Shrink the mask */
            } else {
                crop_path.point_bounds.x2 = crop_path.bounds.right + (event.point.x - crop_path.resize_click_start.x);
            }
            
            if (crop_path.point_bounds.x2 > crop_path.image_bounds.right) {
                crop_path.point_bounds.x2 = crop_path.image_bounds.right;
            }
        }
        
        if (this.crop_mask_adjust.top === true) {
            if (this.crop_mask_adjust.move === true && crop_path.point_bounds.y2 == crop_path.image_bounds.bottom) {
                /* Don't Shrink the mask */
            } else {
                crop_path.point_bounds.y1 = crop_path.bounds.top + (event.point.y - crop_path.resize_click_start.y);
            }
            
            if (crop_path.point_bounds.y1 < crop_path.image_bounds.top) {
                crop_path.point_bounds.y1 = crop_path.image_bounds.top;
            }
        }
        
        if (this.crop_mask_adjust.bottom === true) {
            if (this.crop_mask_adjust.move === true && crop_path.point_bounds.y1 == crop_path.image_bounds.top) {
                /* Don't Shrink the mask */
            } else {
                crop_path.point_bounds.y2 = crop_path.bounds.bottom + (event.point.y - crop_path.resize_click_start.y);
            }
            
            if (crop_path.point_bounds.y2 > crop_path.image_bounds.bottom) {
                crop_path.point_bounds.y2 = crop_path.image_bounds.bottom;
            }
        }

        crop_path.removeSegments();
        crop_path.add({x: crop_path.point_bounds.x1, y: crop_path.point_bounds.y1}, {x: crop_path.point_bounds.x2, y: crop_path.point_bounds.y1});
        crop_path.add({x: crop_path.point_bounds.x2, y: crop_path.point_bounds.y1}, {x: crop_path.point_bounds.x2, y: crop_path.point_bounds.y2});
        crop_path.add({x: crop_path.point_bounds.x2, y: crop_path.point_bounds.y2}, {x: crop_path.point_bounds.x1, y: crop_path.point_bounds.y2});
        crop_path.add({x: crop_path.point_bounds.x1, y: crop_path.point_bounds.y2}, {x: crop_path.point_bounds.x1, y: crop_path.point_bounds.y1});
        
        crop_path.resize_click_start = event.point;
        this.paper_scope.view.draw();
    }
};

UPLOAD_PREVIEW.prototype.notify_upload_complete  = function(successful) {
    if (successful === true) {
        $("#upload_photo_help_inner").html("Finished Uploading Photo");
    } else {
        $("#upload_photo_help_inner").html("Error Uploading Photo");
    }
}

UPLOAD_PREVIEW.prototype.upload_photo_mouse_up  = function(crop_path) {
    crop_path.resize_click_start = {};
    crop_path.resize_click = false;
};

UPLOAD_PREVIEW.prototype.upload_photo_prep  = function() {
    if (this.image_selected === true) {
        /* Show help popup */
        $("#upload_photo_help").css('visibility','visible');
        $("#upload_photo_help_inner").html("Uploading Photo");
                    
        var changed_image = this.paper_scope.project.layers[0].rasterize();
        var img_dataurl = changed_image.toDataURL();
        
        this.upload_photo(img_dataurl);
    }
};