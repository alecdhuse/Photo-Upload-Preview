function UPLOAD_PREVIEW(object_id) {
    this._canvas_id = "upload_photo_canvas";
    this._canvas_height = 300;
    this._canvas_width  = 300;
    this._crop_path = {};
    this._image_crop = false;
    this._image_selected = false;
    this._object_id = object_id;
    this._paper_scope = {};
    this._upload_image_raster;
    
    this._crop_mask_adjust = {
        left:   false,
        right:  false,
        top:    false,
        bottom: false,
        move:   false,
        
        reset: function() {
            this.left = false;
            this.right = false;
            this.top = false;
            this.bottom = false;
            this.move = false;
        }
    };
    
    /* Public */
    this.resize_mouse_margin = 30;
    this.upload_photo = function (data_url) {};
};

UPLOAD_PREVIEW.prototype.init = function(object_id, height, width) {
    if ((typeof height != "undefined") && (typeof width != "undefined")) {
        this._canvas_height = height - 80;
        this._canvas_width  = width;
    }
    
    this._build_objects(object_id);
    this.resize_canvas();
    
    var up_obj = this;
    paper.install(window);
    
    this.canvas = document.getElementById(this._canvas_id);
    this._object_id  = object_id;
    this._paper_scope = new paper.PaperScope();
    
    this._paper_scope.setup(this.canvas);
    paper = this._paper_scope;
    
    /* Write Help Text */
    var text = new paper.PointText(this._paper_scope.view.center);
    text.content = "Click to select a photo";
    text.style = {
        fontFamily: 'Lucida Grande',
        fontWeight: 'bold',
        fontSize: 20,
        fillColor: 'white',
        justification: 'center'
    };
    this._paper_scope.view.draw();
    
    /* Add listeners */
    this.canvas.addEventListener("click", function(event) {
        if (up_obj._image_selected === false) {
            $("#input_upload_image").trigger("click");
        }
    });
    
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
    
    $("#" + this._canvas_id).mouseup(function(event) {
        up_obj._upload_photo_mouse_up(up_obj._crop_path);
    });
}

UPLOAD_PREVIEW.prototype._build_objects = function(parent_object) {
    var canvas_html = "<canvas id='upload_photo_canvas' width='" + this._canvas_width + "' height='" + this._canvas_height + "'></canvas>";
    
    var html_code = "<div id='upload_photo_div'>" + canvas_html + "<div id='upload_photo_help'><div id='upload_photo_help_inner'></div></div></div><div id='upload_photo_footer'><div id='upload_photo_footer_left'><div id='upload_photo_tools'><div class='photo_upload_tool' id='rotate_ccw_div'></div><div class='photo_upload_tool' id='rotate_cw_div'></div><div class='photo_upload_tool' id='crop_photo_div'></div></div><div><input type='file' name='img' size='65' id='input_upload_image' /></div></div><div id='upload_photo_footer_right'></div></div>";
    
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

UPLOAD_PREVIEW.prototype._move_crop_mask  = function(crop_path, event) {
    if (this._crop_path.resize_click === true) {
        if (this._crop_mask_adjust.left === true) {
            if (this._crop_mask_adjust.move === true && crop_path.point_bounds.x2 == crop_path.image_bounds.right) {
                /* Don't Shrink the mask */
            } else {
                crop_path.point_bounds.x1 = crop_path.bounds.left + (event.point.x - crop_path.resize_click_start.x);
            }
            
            if (crop_path.point_bounds.x1 < crop_path.image_bounds.left) {
                crop_path.point_bounds.x1 = crop_path.image_bounds.left;
            }
        }
        
        if (this._crop_mask_adjust.right === true) {
            if (this._crop_mask_adjust.move === true && crop_path.point_bounds.x1 == crop_path.image_bounds.left) {
                /* Don't Shrink the mask */
            } else {
                crop_path.point_bounds.x2 = crop_path.bounds.right + (event.point.x - crop_path.resize_click_start.x);
            }
            
            if (crop_path.point_bounds.x2 > crop_path.image_bounds.right) {
                crop_path.point_bounds.x2 = crop_path.image_bounds.right;
            }
        }
        
        if (this._crop_mask_adjust.top === true) {
            if (this._crop_mask_adjust.move === true && crop_path.point_bounds.y2 == crop_path.image_bounds.bottom) {
                /* Don't Shrink the mask */
            } else {
                crop_path.point_bounds.y1 = crop_path.bounds.top + (event.point.y - crop_path.resize_click_start.y);
            }
            
            if (crop_path.point_bounds.y1 < crop_path.image_bounds.top) {
                crop_path.point_bounds.y1 = crop_path.image_bounds.top;
            }
        }
        
        if (this._crop_mask_adjust.bottom === true) {
            if (this._crop_mask_adjust.move === true && crop_path.point_bounds.y1 == crop_path.image_bounds.top) {
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
        this._paper_scope.view.draw();
    }
};

UPLOAD_PREVIEW.prototype._start_photo_crop  = function() {
    if (this._image_selected === true) {
        paper = this._paper_scope;
        this._image_crop = true;
        $("#crop_photo_svg").attr('class', 'upload_svg_icon_selected');
    
        var img_rotation = Math.abs(Math.round(this._upload_image_raster.rotation));
        var photo_size = this._upload_image_raster.size;
        var crop_width = 0;
        var crop_height = 0;
        var up_obj = this;
        
        if (img_rotation == 90 || img_rotation == 270) {
            var crop_width = photo_size.height;
            var crop_height = photo_size.width;
            
            var point_bounds = {
                x1: this._paper_scope.view.center.x - (photo_size.height / 2),
                x2: this._paper_scope.view.center.x - (photo_size.height / 2) + photo_size.height,
                y1: this._paper_scope.view.center.y - (photo_size.width / 2),
                y2: this._paper_scope.view.center.y - (photo_size.width / 2) + photo_size.width
            };
        } else {
            var crop_width = photo_size.width;
            var crop_height = photo_size.height;
            
            var point_bounds = {
                x1: this._paper_scope.view.center.x - (photo_size.width / 2),
                x2: this._paper_scope.view.center.x - (photo_size.width / 2) + photo_size.width,
                y1: this._paper_scope.view.center.y - (photo_size.height / 2),
                y2: this._paper_scope.view.center.y - (photo_size.height / 2) + photo_size.height
            };
        }
        
        var crop_rectangle = new Rectangle(point_bounds.x1, point_bounds.y1, crop_width, crop_height);
        this._crop_path = new Path.Rectangle(crop_rectangle);

        this._crop_path.selectedColor = new Color(0.8, 0.8, 0.8, 0.7);
        this._crop_path.fillColor = new Color(0, 0, 0, 0);
        this._crop_path.strokeColor = new Color(0.8, 0.8, 0.8, 0.7);
        this._crop_path.strokeWidth = 20;
        
        this._crop_path.resize_click = false;
        this._crop_path.resize_click_start = {};
        this._crop_path.point_bounds = point_bounds;
        this._crop_path.image_bounds = {
            left:   point_bounds.x1,
            right:  point_bounds.x2,
            top:    point_bounds.y1,
            bottom: point_bounds.y2
        };
        
        /* Crop Path Mouse Events */
        this._crop_path.onMouseLeave = function(event) {
            $("#upload_photo_canvas").css('cursor', 'auto');
        }

        this._crop_path.onMouseMove = function(event) {
            if (this.resize_click === false) {
                if ( (event.point.y < this.point_bounds.y1 + up_obj.resize_mouse_margin) && (event.point.x < this.point_bounds.x1 + up_obj.resize_mouse_margin)) {
                    /* Top Left */
                    $("#upload_photo_canvas").css('cursor', 'nwse-resize');
                } else if ( (event.point.y < this.point_bounds.y1 + up_obj.resize_mouse_margin) && (event.point.x > this.point_bounds.x2 - up_obj.resize_mouse_margin)) {
                    /* Top Right */
                    $("#upload_photo_canvas").css('cursor', 'nesw-resize');
                } else if ( (event.point.y > this.point_bounds.y2 - up_obj.resize_mouse_margin) && (event.point.x < this.point_bounds.x1 + up_obj.resize_mouse_margin)) {
                    /* Bottom Left */
                    $("#upload_photo_canvas").css('cursor', 'nesw-resize');
                } else if ( (event.point.y > this.point_bounds.y2 - up_obj.resize_mouse_margin) && (event.point.x > this.point_bounds.x2 - up_obj.resize_mouse_margin)) {
                    /* Bottom Right */
                    $("#upload_photo_canvas").css('cursor', 'nwse-resize');
                } else if (event.point.y < this.point_bounds.y1 + up_obj.resize_mouse_margin) {
                    /* Top */
                    $("#upload_photo_canvas").css('cursor', 'row-resize');
                } else if (event.point.y > this.point_bounds.y2 - up_obj.resize_mouse_margin) {
                    /* Bottom */
                    $("#upload_photo_canvas").css('cursor', 'row-resize');
                } else if (event.point.x < this.point_bounds.x1 + up_obj.resize_mouse_margin) {
                    /* Left Side */
                    $("#upload_photo_canvas").css('cursor', 'col-resize');
                } else if (event.point.x > this.point_bounds.x2 - up_obj.resize_mouse_margin) {
                    /* Right Side */
                    $("#upload_photo_canvas").css('cursor', 'col-resize');
                } else {
                    $("#upload_photo_canvas").css('cursor', 'move');
                }
            } else {
                up_obj._move_crop_mask(this, event);
            }
        }

        this._crop_path.onMouseDown = function(event) {
            this.resize_click_start = event.point;
            this.resize_click = true;
            
            /* Reset crop mask move flags */
            up_obj._crop_mask_adjust.reset();
                
            if ( (event.point.y < this.point_bounds.y1 + up_obj.resize_mouse_margin) && (event.point.x < this.point_bounds.x1 + up_obj.resize_mouse_margin)) {
                /* Top Left */
                up_obj._crop_mask_adjust.left = true;
                up_obj._crop_mask_adjust.top = true;
            } else if ((event.point.y < this.point_bounds.y1 + up_obj.resize_mouse_margin) && (event.point.x > this.point_bounds.x2 - up_obj.resize_mouse_margin)) {
                /* Top Right */
                up_obj._crop_mask_adjust.right = true;
                up_obj._crop_mask_adjust.top = true;
            } else if ((event.point.y > this.point_bounds.y2 - up_obj.resize_mouse_margin) && (event.point.x < this.point_bounds.x1 + up_obj.resize_mouse_margin)) {
                /* Bottom Left */
                up_obj._crop_mask_adjust.left = true;
                up_obj._crop_mask_adjust.bottom = true;
            } else if ((event.point.y > this.point_bounds.y2 - up_obj.resize_mouse_margin) && (event.point.x > this.point_bounds.x2 - up_obj.resize_mouse_margin)) {
                /* Bottom Right */
                up_obj._crop_mask_adjust.right = true;
                up_obj._crop_mask_adjust.bottom = true;
            } else if (event.point.y < this.point_bounds.y1 + up_obj.resize_mouse_margin) {
                /* Top */
                up_obj._crop_mask_adjust.top = true;
            } else if (event.point.y > this.point_bounds.y2 - up_obj.resize_mouse_margin) {
                /* Bottom */
                up_obj._crop_mask_adjust.bottom = true;
            } else if (event.point.x < this.point_bounds.x1 + up_obj.resize_mouse_margin) {
                /* Left Side */
                up_obj._crop_mask_adjust.left = true;
            } else if (event.point.x > this.point_bounds.x2 - up_obj.resize_mouse_margin) {
                /* Right Side */
                up_obj._crop_mask_adjust.right = true;
            } else {
                up_obj._crop_mask_adjust.left = true;
                up_obj._crop_mask_adjust.right = true;
                up_obj._crop_mask_adjust.top = true;
                up_obj._crop_mask_adjust.bottom = true;
                up_obj._crop_mask_adjust.move = true;
            }
        }
        
        this._crop_path.onMouseUp = function(event) {
            up_obj._upload_photo_mouse_up(this);
        }

        this._paper_scope.view.draw();
    }
};

UPLOAD_PREVIEW.prototype._upload_photo_mouse_up  = function(crop_path) {
    crop_path.resize_click_start = {};
    crop_path.resize_click = false;
    this._crop_mask_adjust.reset();
};

UPLOAD_PREVIEW.prototype._upload_photo_prep  = function() {
    if (this._image_selected === true) {
        /* Show help popup */
        $("#upload_photo_help").css('visibility','visible');
        $("#upload_photo_help_inner").html("Uploading Photo");
                    
        var changed_image = this._paper_scope.project.layers[0].rasterize();
        var img_dataurl = changed_image.canvas.toDataURL("image/jpeg").replace(/ /g, '+');
        
        this.upload_photo(img_dataurl);
    }
};

UPLOAD_PREVIEW.prototype.cancel_crop  = function() {
    $("#crop_photo_svg").attr('class', 'upload_svg_icon');
    this._image_crop = false;
    this._crop_path.removeSegments();
    this._paper_scope.view.draw();
};

UPLOAD_PREVIEW.prototype.crop_button  = function(up_obj) {
    if (up_obj._image_crop === true) {
        up_obj.cancel_crop();
    } else {
        up_obj._start_photo_crop();
    }
};

UPLOAD_PREVIEW.prototype.draw  = function(up_obj, ev) {
    this._paper_scope.project.clear();
    
    var img = new Image();
    var f = document.getElementById("input_upload_image").files[0];
    
    if (window.FileReader) {
        var reader  = new FileReader();
        
        reader.onloadend = function () {
            var src = reader.result;
            up_obj.set_raster(src, 0);
        }
        
        reader.readAsDataURL(f);
    } else {
        var url = window.URL || window.webkitURL;
        var src = url.createObjectURL(f);
        this.set_raster(src, 0);
    }
};

UPLOAD_PREVIEW.prototype.resize_canvas  = function() {
    $("#" + this._object_id).css({'width':  this._canvas_width});
    $("#" + this._object_id).css({'height': this._canvas_height + 80});
    $("#" + this._canvas_id).css({'width':  this._canvas_width});
    $("#" + this._canvas_id).css({'height': this._canvas_height});
    
    var photo_help_top = $("#upload_photo_footer").position().top - 110;
    $("#upload_photo_help").css({'top': photo_help_top});
};

UPLOAD_PREVIEW.prototype.resize_raster  = function() {
    paper = this._paper_scope;
    this._upload_image_raster.position = this._paper_scope.view.center;
    this._paper_scope.view.zoom = 1;
    
    var photo_size = this._upload_image_raster.size;
    var view_size = this._paper_scope.view.size;
    var width_ratio  = view_size.width  / photo_size.width;
    var height_ratio = view_size.height / photo_size.height;
    var img_rotation = Math.abs(Math.round(this._upload_image_raster.rotation));
    var up_obj = this;
    
    if (img_rotation == 90 || img_rotation == 270) {
        if (width_ratio < height_ratio) {
            this._paper_scope.view.zoom = width_ratio;
        } else {
            this._paper_scope.view.zoom = height_ratio;
        }
        
        if (this._paper_scope.view.size.width < photo_size.height) {
            this._paper_scope.view.zoom = this._paper_scope.view.zoom * (this._paper_scope.view.size.width / photo_size.height);
        }
    } else {
        if (width_ratio < height_ratio) {
            this._paper_scope.view.zoom = width_ratio;
        } else {
            this._paper_scope.view.zoom = height_ratio;
        }
    }
    
    this._upload_image_raster.onMouseMove = function(event) {
        if (up_obj._image_crop === true) {
            up_obj._move_crop_mask(up_obj._crop_path, event);
        }
    }
    
    this._upload_image_raster.onMouseUp = function(event) {
        up_obj._upload_photo_mouse_up(up_obj._crop_path);
    }
    
    this._paper_scope.view.draw();
};

UPLOAD_PREVIEW.prototype.rotate_cw  = function(up_obj) {
    up_obj._upload_image_raster.rotate(90);

    if (typeof up_obj._crop_path.rotate != "undefined") {
        up_obj._crop_path.rotate(90);
    }

    up_obj.resize_raster();
};

UPLOAD_PREVIEW.prototype.rotate_ccw  = function(up_obj) {
    up_obj._upload_image_raster.rotate(-90);
    
    if (typeof up_obj._crop_path.rotate != "undefined") {
        up_obj._crop_path.rotate(-90);
    }
    
    up_obj.resize_raster();
};

UPLOAD_PREVIEW.prototype.ok_button  = function() {
    if (this._image_selected === true) {
        if (this._image_crop === false) {
            this._upload_photo_prep();
        } else {
            /* Crop Photo */
            paper = this._paper_scope;
            var img_rotation = this._upload_image_raster.rotation;
        
            if (Math.abs(Math.round(img_rotation)) != 0) {
                var crop_x = this._crop_path.point_bounds.y1 - this._crop_path.image_bounds.top;
                var crop_y = this._crop_path.image_bounds.right - this._crop_path.point_bounds.x2;
                var crop_w = this._crop_path.bounds.height;
                var crop_h = this._crop_path.bounds.width;
            } else {
                var crop_x = this._crop_path.point_bounds.x1 - this._crop_path.image_bounds.left;
                var crop_y = this._crop_path.point_bounds.y1 - this._crop_path.image_bounds.top;
                var crop_w = this._crop_path.point_bounds.x2 - this._crop_path.point_bounds.x1;
                var crop_h = this._crop_path.point_bounds.y2 - this._crop_path.point_bounds.y1;
            }
            
            var crop_bounds = new Rectangle(crop_x, crop_y, crop_w, crop_h);
            var cropped_dataurl = this._upload_image_raster.getSubRaster(crop_bounds).toDataURL();
            
            this._paper_scope.project.clear();
            
            this.set_raster(cropped_dataurl, img_rotation);
            
            this._image_crop = false;
            $("#crop_photo_svg").attr('class', 'upload_svg_icon');
        }
    }
};

UPLOAD_PREVIEW.prototype.set_raster  = function(src, img_rotation) {
    var up_obj = this;
    paper = this._paper_scope;
    
    this._paper_scope.project.clear();
    this._upload_image_raster = new Raster(src);
    this._upload_image_raster.onLoad = function() {
        up_obj.resize_raster();
        up_obj._image_selected = true;
        
        if (Math.abs(Math.round(img_rotation)) != 0) {
            this._upload_image_raster.rotate(img_rotation);
        }
        
        $("#rotate_ccw_svg").attr('class', 'upload_svg_icon');
        $("#rotate_cw_svg").attr('class', 'upload_svg_icon');
        $("#crop_photo_svg").attr('class', 'upload_svg_icon');
        $("#photo_upload_ok_svg").attr('class', 'upload_svg_icon');
    };
}

UPLOAD_PREVIEW.prototype.notify_upload_complete  = function(successful) {
    if (successful === true) {
        $("#upload_photo_help_inner").html("Finished Uploading Photo");
    } else {
        $("#upload_photo_help_inner").html("Error Uploading Photo");
    }
}
