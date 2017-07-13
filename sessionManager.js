(function () {
    var SessionManager = function (userid, username, targetArea) {
        return {
            userid: userid,
            username: username,
            targetArea: targetArea,

            _filename: 'sessions.json',
            _filelocation: "https://mytatts.tattsgroup.com/f/1f9b2",
            _uploadlocation: "https://mytatts.tattsgroup.com/fu?&intelliUpload=Y&folder_id=100746",
            _postMessageLocation: "https://mytatts.tattsgroup.com/api/users/{current_user_id}/wall.json",
            _template: `
                <div class="clearfloat"></div>
                <div class="feed-post-preview blog-post-attachments ms-post-attachment embeded-link-preview" id="custom_sessionContent_{id}">
                    <div class="feed-post-preview-holder">
                        <div class="ma-h3 bold bottom-5 element-link">{name}</div>
                        <div class="post_preview_content ma-h5">
                            {outline}
                        </div>
                        <div class="ma-h5">
                            <div class="ma-h5 bold">
                                Signed up ({currentAttendeesCount}/{max_size}):
                            </div>
                            {currentAttendees}
                        </div>
                        <div class="ma-h5">
                            <div class="ma-h5 bold">
                                Waiting list:
                            </div>
                            {overflowAttendees}
                        </div>                        
                    </div>    
                    <div class="top-5 ma-h5 ma-link ma-read-more-act font-13" style="width: 60px; float: left;" id="custom_readmoreButton_{id}">Read More</div>
                    <div class="top-5 ma-h5 ma-link ma-read-more-act font-13" style="width: 60px; float: left;" id="custom_attendenceActionButton_{id}">{buttonText}</div>
                </div>
                <div class="clearfloat"></div>
                <br/>
            `,

            _mapTemplate: function (props) {
                return function (tok, i) {
                    return (i % 2) ? props[tok] : tok;
                };
            },

            _renderSession: function (session) {
                var that = this;
                return that._template.split(new RegExp("{(.+?)\}", "g")).map(that._mapTemplate(session)).join('');
            },

            _upload: function (data) {
                var that = this;
                var formData = new FormData();
                formData.append('file', new File([new Blob([JSON.stringify(data)])], that._filename));

                return jQuery.ajax(that._uploadlocation, {
                    method: "POST",
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false
                });
            },

            _postMessage: function (message) {
                var that = this;

                var data = {
                    ms_request: {
                        feed: {
                            attachments: [],
                            body: 'hello',
                            group_id: 1202,
                            feed_type: 'group'
                        }
                    }
                };

                var url = that._postMessageLocation.split(new RegExp("{(.+?)\}", "g")).map(that._mapTemplate({ current_user_id: that.userid })).join('');

                return jQuery.ajax(url, {
                    method: "POST",
                    data: data,
                    dataType: 'json'
                }).fail(function() {
                    debugger;
                }).done(function() {
                    debugger;
                });
            },

            _showDialog: function (title, message) {
                var that = this;
                SimpleDialog.reset();
                SimpleDialog.show({
                    title: title,
                    body: message,
                    params: new Hash({
                        width: "650px",
                        fixedcenter: true,
                        modal: true,
                        draggable: false,
                        constraintoviewport: true,
                        buttons: [
                            {
                                text: "Ok",
                                handler: function () { this.hide(); }
                            },
                        ],
                    })
                });
            },

            _loading: function () {
                var that = this;
                that.targetArea.empty().append('<div><div class="tip-holder"><div class="t-editable blank-layout" data-tooltip-class="custom-tooltip" id="custom_content"><p>Loading...</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;/p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&bsp;/p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&bsp;/p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&bsp;/p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&bsp;/p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&bsp;/p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p><span class="blank-placeholder-text"></span></p></div>  </div></div>');
            },

            _failed: function () {
                debugger;
                var that = this;
                console.log("FAILED: " + that._filelocation);
                console.log(arguments);
            },

            DropOut: function (sessionId) {
                var that = this;
                var defer = jQuery.Deferred();

                jQuery.ajax(that._filelocation, { dataType: "json" }).fail(defer.reject).done(function (data) {
                    var removedFromSession = false;
                    jQuery.each(data.sessions, function (index, session) {
                        if (session.id === sessionId) {
                            var index = jQuery.inArray(that.username, session.attendees);
                            if (index !== -1) {
                                session.attendees.splice(index, 1);
                                removedFromSession = true;
                            } else {
                                that._showDialog("Error", "You weren't signed up for this.");
                            }
                            return; // exit loop
                        }
                    });
                    if (removedFromSession) {
                        that._upload(data).fail(defer.reject).done(defer.resolve);
                    }
                });

                return defer.promise();
            },

            Signup: function (sessionId) {
                var that = this;
                var defer = jQuery.Deferred();

                jQuery.ajax(that._filelocation, { dataType: "json" }).fail(defer.reject).done(function (data) {
                    var sessionAvailable = undefined;
                    jQuery.each(data.sessions, function (index, session) {
                        if (session.id === sessionId) {
                            var index = jQuery.inArray(that.username, session.attendees);
                            if (index === -1) {
                                session.attendees.push(that.username);
                                sessionAvailable = session;
                            } else {
                                that._showDialog("Error", "You've already signed up for this. Try reloading the page.");
                            }
                            return; // exit loop
                        }
                    });
                    if (sessionAvailable != undefined) {
                        that._upload(data).fail(defer.reject).done(defer.resolve);
                        //that._postMessage(that.username + " just signed up for " + sessionAvailable.name + "! Spots are filling up fast - get yours at " + document.location + "!");
                    }
                });

                return defer.promise();
            },

            LoadSessions: function () {
                var that = this;
                that._loading();

                return jQuery.ajax(that._filelocation, { dataType: "json" }).fail(that._failed).done(function (data) {
                    that.targetArea.find("#custom_content").empty().append("<br/>");

                    jQuery.each(data.sessions, function (index, session) {
                        var renderData = Object.assign({}, session);

                        var signedUp = session.attendees.slice(0, session.max_size);
                        renderData.currentAttendees = signedUp.length > 0 ? session.attendees.slice(0, session.max_size).join(", ") : "No one - be the first!";
                        renderData.currentAttendeesCount = signedUp.length;
                        if (signedUp.length >= session.max_size) {
                            renderData.currentAttendees = "<b style='color: red;'>Session Full</b><br/>" + renderData.currentAttendees;
                        }

                        var overflow = session.attendees.slice(session.max_size);
                        renderData.overflowAttendees = overflow.length > 0 ? session.attendees.slice(session.max_size).join(",") : signedUp.length >= session.max_size ? "Join the wait list now!" : "When the session fills up you'll have to join the wait list - so sign up now!";

                        renderData.buttonText = jQuery.inArray(that.username, session.attendees) === -1 ? "Sign up" : "Drop out";

                        that.targetArea.find("#custom_content").append(that._renderSession(renderData));

                        if (jQuery.inArray(that.username, session.attendees) === -1) {
                            jQuery("#custom_attendenceActionButton_" + session.id).click(function () {
                                that.Signup(session.id).fail(that._failed).done(function () {
                                    that.LoadSessions();
                                });
                            });
                        } else {
                            jQuery("#custom_attendenceActionButton_" + session.id).click(function () {
                                that.DropOut(session.id).fail(that._failed).done(function () {
                                    that.LoadSessions();
                                });
                            });
                        }

                        jQuery("#custom_readmoreButton_" + session.id).click(function () {
                            that._showDialog(session.name, session.outline);
                        });
                    });
                });
            },
        };
    };

    var sessionMgr = new SessionManager(current_user_id, current_user_name /* from mango apps globals */, jQuery('#intranet-template-container > * > .tip-holder').first());
    sessionMgr.LoadSessions();
})();