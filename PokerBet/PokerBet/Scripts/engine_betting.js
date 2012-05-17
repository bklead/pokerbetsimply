function getMyName() {
    if (window.location.toString().match(/inside|inbet/)) {
        return "INSiDE";
    }
    return " ";
}

function getInStatus() {
    if (window.location.toString().match(/inside|inbet/)) {
        return 1;
    }
    return 0;
}

var 
	timeDelta = 0;

function niceRandom() {
    return Math.round(Math.random() * 1000000);
}

function getFInt(val) {
    if (val < 10) { val = '0' + val; }
    return val;
}

function tickClock() {
    var ld = new Date();
    var sd = new Date(ld.getTime() - timeDelta);
    var tstr = getFInt(sd.getDate()) + "." +
			getFInt(sd.getMonth() + 1) + "." +
			(sd.getYear() + 1900) + " " +
			getFInt(sd.getHours()) + ':' +
			getFInt(sd.getMinutes()) + ':' +
			getFInt(sd.getSeconds());

    $('#wallclock').html(tstr);
    setTimeout('tickClock()', 1000);
}

function wallclock() {
  /*  $.ajax({ type: 'GET', url: 'support.php?cmd=getmsec&id=' + niceRandom(), timeout: 3000,
        success: function (data) {
            var d = new Date();
            timeDelta = d.getTime() - data * 1000; // now we have delta here...
            setTimeout('wallclock()', 3600 * 1000);
        },
        error: function () {
            $('#wallclock').html('ÐÐµÑ‚ ÑÐ²ÑÐ·Ð¸...');
            setTimeout('wallclock()', 1000);
        }
    });*/
}

function showTooltip(obj) {
    if (obj.attr('tip') != '') {
        var pos = obj.offset();
        var height = obj.height();
        $('#hint').css({ "left": (pos.left) + "px", "top": (pos.top + height) + "px" });
        $('#hint').html("&nbsp;" + obj.attr('tip') + "&nbsp;");
        $('#hint').show();
    }
}

function hideTooltip() {
    $('#hint').hide();
}

var logoPosition = 0;
function showLogo(divid, logostr) {
    if (logoPosition < logostr.length) {
        logoPosition++;
        $(divid).append('<span id="l' + logoPosition + '" style="color:#ffffff;display:none;">' + logostr.substring(logoPosition - 1, logoPosition) + '</span>');
        $('#l' + logoPosition).fadeIn(1000, function () {
            $(this).css('color', '#7f7f7f');
            if ($(this).attr('id') == 'l1') {
                setTimeout("$('#l1').css('color', '#bfbfbf');logoShown()", 500);
            }
        });
        setTimeout("showLogo('" + divid + "', '" + logostr + "')", 100);
    }
}
function glideNext(n) {
    if (n == 2) {
        $('#l' + (n - 1)).css('color', '#bfbfbf');
    } else {
        $('#l' + (n - 1)).css('color', '#7f7f7f');
    }
    if ($('#l' + n).length == 1) {
        $('#l' + n).css('color', '#ffffff');
        n++;
        setTimeout("glideNext(" + n + ")", 100);
    } else {
        setTimeout("glideLogo()", 5000);
    }
}
function glideLogo() {
    $('#l1').css('color', '#ffffff');
    setTimeout("glideNext(2)", 100);
}
function logoShown() {
    setTimeout("glideLogo()", 5000);
}
/*
* Following two functions messageBox() and waitBox() is an example
* of true power of javascript/DOM model.. these are checking if dialogs
* already in the DOM or not, quite optimal solution.
*/
function messageBox(info) {
    if ($('#messageBox').length == 0) {
        $('body').append('<div title="' + getMyName() + '" id="messageBox" style="display:none"></div>');
        $('#messageBox').dialog({
            modal: true,
            autoOpen: false,
            position: 'center',
            buttons: {
                "Ð¥Ð¾Ñ€Ð¾ÑˆÐ¾": function () {
                    $(this).dialog("close");
                }
            }
        });
        $('#messageBox').parent().keyup(function (e) {
            if (e.keyCode == 13) {
                $('#messageBox').parent().find('button:contains(Ð¥Ð¾Ñ€Ð¾ÑˆÐ¾)').trigger('click');
            }
        });
    }
    $('#messageBox').html(info).dialog("open");
    $('#messageBox').focus();
}
function waitBox(info) {
    if ($('#waitBox').length == 0) {
        $('body').append('<div title="' + getMyName() + '" id="waitBox" style="display:none; z-index:9999;"></div>');
        $('#waitBox').dialog({
            modal: true,
            autoOpen: false
        });
    }
    $('#waitBox').html(info).dialog("open");
}
function unwaitBox() {
    $('#waitBox').dialog("close");
}

function waitBox2(info) {
    if ($('#waitBox2').length == 0) {
        $('body').append('<div title="' + getMyName() + '" id="waitBox2" style="display:none"></div>');
        $('#waitBox2').dialog({
            modal: true,
            autoOpen: false
        });
    }
    $('#waitBox2').html(info).dialog("open");
}
function unwaitBox2() {
    $('#waitBox2').dialog("close");
}


function waitBox3(info) {
    if ($('#waitBox3').length == 0) {
        $('body').append('<div title="' + getMyName() + '" id="waitBox3" style="display:none; z-index:9999;"></div>');
        $('#waitBox3').dialog({
            modal: true,
            autoOpen: false
        });
    }
    $('#waitBox').html(info).dialog("open");
}
function unwaitBox3() {
    alert('Closing');
    $('#waitBox3').dialog("close");
}

var 
	currentHash = '';

function processTemplate(template, data) {
    var re = /:[a-zA-Z][a-zA-Z0-9\-_]+/g;
    var lexeme;
    var resultString = template;

    while (lexeme = re.exec(template)) {
        var key = lexeme[0].replace(/^:/, '');
        if (data[key] != null) {
            resultString = resultString.replace(lexeme[0], data[key]);
        } else {
            $('#livepanel').append('Ð’Ð½ÑƒÑ‚Ñ€ÐµÐ½Ð½ÑÑ Ð¾ÑˆÐ¸Ð±ÐºÐ°! [' + key + '] == [' + data[key] + '] - Ð¾Ð±Ñ€Ð°Ñ‚Ð¸Ñ‚ÐµÑÑŒ Ðº Ñ€Ð°Ð·Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸ÐºÑƒ.<br>');
        }
    }
    return resultString;
}

function query_live() {
    var eventsThTemplate = "<tr><th>Ð²Ð¸Ð´ ÑÐ¿Ð¾Ñ€Ñ‚Ð°</th><th>Ð»Ð¸Ð³Ð°</th><th>ÑÐ¾Ð±Ñ‹Ñ‚Ð¸Ðµ</th><th>ÑÑ‡ÐµÑ‚</th><th>&nbsp;&nbsp;&nbsp;&nbsp;Ð½Ð°Ñ‡Ð°Ð»Ð¾ ÑÐ¾Ð±Ñ‹Ñ‚Ð¸Ñ&nbsp;&nbsp;&nbsp;&nbsp;</th></tr>";
    var eventsTrTemplate = '<tr class="eventRow eventSource:source" event_id=":id" event_name=":nameRU" eventBeginMSK=":eventBeginMSK"><td align="center">:sport_name</td><td class="tooltip" tip=":league_nameRU">:league_nameRU_sub</td><td>(<span style="color:green;">:uniID</span>) :nameRU</td><td align="center" class="eventScore" eventName=":nameRU">:score</td><td align="center" class="eventTimeTd" event_id=":id" event_name=":nameRU">:eventBeginMSK</td></tr>';
  /*  $.ajax({ type: 'POST', url: 'support.php', data: 'h=' + currentHash + '&cmd=Q&' + Math.random() + '&c=' + $('#compactifyData:checked').length, timeout: 15000,
        success: function (data) {
            unwaitBox2();
            try {
                var liveEvents = eval("(" + data + ")"); // this is evil thing, but works like magic:)
                if (liveEvents["hash"] != currentHash) {
                    var content = '<center><table style="color:' + (getInStatus() == 1 ? '#afafaf;' : '#0f0f0f;') + '">' + eventsThTemplate;
                    for (var event in liveEvents) {
                        if (event != "hash") {
                            content += processTemplate(eventsTrTemplate, liveEvents[event]);
                        }
                    }
                    content += "</table></center>";
                    $('#livepanel').html(content);
                } else {
                    // hashes are equal, setting balance
                    if (liveEvents["balance"] != null) {
                        $('#balance').html(liveEvents["name"] + ",&nbsp;" + liveEvents["balance"] + '<b>RUR</b>');
                    }
                }
                currentHash = liveEvents["hash"];
                setTimeout(query_live, 5000);
            } catch (e) {
                waitBox2('Ð¡ÐµÑ€Ð²ÐµÑ€ Ð²ÐµÑ€Ð½ÑƒÐ» Ð¾ÑˆÐ¸Ð±Ð¾Ñ‡Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ - Ð¿Ñ€Ð¾Ð±ÑƒÐµÐ¼ ÐµÑ‰Ðµ Ñ€Ð°Ð·...');
                setTimeout(query_live, 5000);
            }
        },
        error: function () {
            // for some unknown reason - communication with server failed...
            // waitBox2('ÐžÑˆÐ¸Ð±ÐºÐ° Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ Ð´Ð°Ð½Ð½Ñ‹Ñ… - Ð¿Ñ€Ð¾Ð±ÑƒÐµÐ¼ ÐµÑ‰Ðµ Ñ€Ð°Ð·...');
            setTimeout(query_live, 5000);
        }
    });*/
}

function initialize_live() {
  /*  $.ajax({ type: 'POST', url: 'support.php', data: 'cmd=InitLive', timeout: 10000,
        success: function (data) {
            if (data.match(/^OK/)) {
                // live initialized.
                setTimeout(query_live, 1000);
            } else {
                $('#livepanel').html('ÐžÑˆÐ¸Ð±ÐºÐ° Ð¸Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ð¸ Ñ€ÐµÐ¶Ð¸Ð¼Ð° live. ÐŸÐ¾Ð¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ Ð¿ÐµÑ€ÐµÐ·Ð°Ð³Ñ€ÑƒÐ·Ð¸Ñ‚ÑŒ ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñƒ.');
            }
        },
        error: function () {
            initialize_live();
        }
    });*/
}

function replacer(key, value) {
    if (typeof value === 'number' && !isFinite(value)) {
        return String(value);
    }
    return value;
}

function showClientSearchResults(data) {
    if ($('#clientSearchResults').length == 0) {
        $('body').append('<div id="clientSearchResults" title="' + getMyName() + '::Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ Ð¿Ð¾Ð¸ÑÐºÐ°" style="font-family:Verdana, sans-serif; font-size:11px; text-align:center; display:none"></div>');
        $('#clientSearchResults').dialog({
            modal: true,
            autoOpen: false,
            width: 800,
            buttons: {
                "Ð¥Ð¾Ñ€Ð¾ÑˆÐ¾": function () { $(this).dialog("close"); }
            }
        });
    }
    try {
        var results = eval(data);
        if (results.length > 0) {
            var results_str = "";
            results_str = '<center><table style="font-family:Verdana, sans-serif; font-size:14px; color:rgb(0,0,0);" cellspacing="1">';
            results_str += "<tr><th>&nbsp;ÐºÐ°Ñ€Ñ‚Ñ‹&nbsp;</th><th>&nbsp;Ð¤Ð˜Ðž&nbsp;</th><th>&nbsp;Ñ‚ÐµÐ»ÐµÑ„Ð¾Ð½&nbsp;</th><th>&nbsp;Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚&nbsp;</th><th>&nbsp;Ð¿Ñ€Ð¸Ð¼ÐµÑ‡Ð°Ð½Ð¸Ðµ&nbsp;</th><th>&nbsp;ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ&nbsp;</th></tr>";
            for (i = 0; i < results.length; i++) {
                results_str += '<tr><td align="center">' + results[i]['cid'] +
				'</td><td align="center">' + results[i]['fio'] +
				'</td><td align="center">' + results[i]['phone'] +
				'</td><td align="center">' + results[i]['doc'] +
				'</td><td align="center">' + results[i]['note'] +
				'</td><td align="center">' +
				'<span class="aDialog cliResCmd" cmd="clientDel" cid="' + results[i]['cid'] + '">ÑƒÐ´Ð°Ð»Ð¸Ñ‚ÑŒ</span>&nbsp;<span class="aDialog cliResCmd" cmd="clientAddNote" cid="' + results[i]['cid'] + '">Ð¿Ñ€Ð¸Ð¼ÐµÑ‡Ð°Ð½Ð¸Ðµ</span>&nbsp;<span class="aDialog cliResCmd" cmd="clientDetails" cid="' + results[i]['cid'] + '">Ð¾Ñ‚Ñ‡ÐµÑ‚</span>&nbsp;<span class="aDialog cliResCmd" cmd="clientEdit" json=\'' + JSON.stringify(results[i], replacer) + '\' cid="' + results[i]['cid'] + '">Ñ€ÐµÐ´Ð°ÐºÑ‚Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ</span>' +
				'</td></tr>';
            }
            results_str += "</table></center>";
            results_str += "<br>ÐÐ°Ð¹Ð´ÐµÐ½Ð¾: " + results.length + " ÐºÐ»Ð¸ÐµÐ½Ñ‚(-Ð¾Ð²)<br>";
            $('#clientSearchResults').html(results_str).dialog("open");
        } else {
            messageBox('ÐŸÐ¾ ÑƒÐºÐ°Ð·Ð°Ð½Ð½Ñ‹Ð¼ Ð¿Ñ€Ð¸Ð·Ð½Ð°ÐºÐ°Ð¼ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÐµÐ¹ Ð½Ðµ Ð½Ð°Ð¹Ð´ÐµÐ½Ð¾');
        }
    } catch (e) {
        messageBox("ÐžÑˆÐ¸Ð±ÐºÐ°: " + data);
    }
}

function searchClient() {
    if ($('#searchClientBox').length == 0) {
        // need to create search box
        $('body').append('<div id="searchClientBox" title="' + getMyName() + '::Ð¿Ð¾Ð¸ÑÐº ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð°" style="font-size:11px; display:none; text-align:center;"><p style="text-align:justify;">Ð’Ð²ÐµÐ´Ð¸Ñ‚Ðµ Ñ‡Ð°ÑÑ‚ÑŒ Ð¸Ð¼ÐµÐ½Ð¸, Ð½Ð¾Ð¼ÐµÑ€ ÐºÐ°Ñ€Ñ‚Ñ‹ ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð° Ð¸Ð»Ð¸ Ð½Ð¾Ð¼ÐµÑ€ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð°, ÑƒÐºÐ°Ð·Ð°Ð½Ð½Ð¾Ð³Ð¾ Ð¿Ñ€Ð¸ Ñ€ÐµÐ³Ð¸ÑÑ‚Ñ€Ð°Ñ†Ð¸Ð¸.</p><input id="searchClientBoxEdit" type=text" size="30"><br><span id="searchClientBoxHint">&nbsp;</span></div>');
        $('#searchClientBox').dialog({
            modal: true,
            autoOpen: false,
            buttons: {
                "ÐÐ°Ð¹Ñ‚Ð¸": function () {
                    var str = $('#searchClientBoxEdit').val();
                    if (str.length == 0) {
                        $('#searchClientBoxHint').html('Ð’Ð²ÐµÐ´Ð¸Ñ‚Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð´Ð»Ñ Ð¿Ð¾Ð¸ÑÐºÐ°!!!');
                        $('#searchClientBoxEdit').focus();
                    } else {
                        waitBox('ÐŸÑ€Ð¾Ð¸Ð·Ð²Ð¾Ð´Ð¸Ñ‚ÑÑ Ð¿Ð¾Ð¸ÑÐº... Ð¿Ð¾Ð´Ð¾Ð¶Ð´Ð¸Ñ‚Ðµ...');
                        $(this).dialog("close");
                   /*     $.ajax({ type: 'POST', url: 'support.php', data: 'cmd=searchClient&q=' + str, timeout: 10000,
                            success: function (data) {
                                unwaitBox();
                                // some strange magic to show clients...:)
                                showClientSearchResults(data);
                            },
                            error: function () {
                                unwaitBox();
                                messageBox('ÐžÑˆÐ¸Ð±ÐºÐ° ÑÐ²ÑÐ·Ð¸ Ñ ÑÐµÑ€Ð²ÐµÑ€Ð¾Ð¼ - Ð¿Ð¾Ð²Ñ‚Ð¾Ñ€Ð¸Ñ‚Ðµ Ð¿Ð¾Ð¿Ñ‹Ñ‚ÐºÑƒ');
                            }
                        });*/
                    }
                },
                "ÐžÑ‚Ð¼ÐµÐ½Ð¸Ñ‚ÑŒ": function () {
                    $(this).dialog("close");
                }
            }
        });
        $('#searchClientBoxEdit').keyup(function (e) {
            $('#searchClientBoxHint').html('&nbsp;');
            if (e.keyCode == 13) {
                $('#searchClientBox').parent().find('button:contains(ÐÐ°Ð¹Ñ‚Ð¸)').trigger('click');
            }
        });
    }
    $('#searchClientBox').dialog("open");
    $('#searchClientBoxEdit').val('').focus();
}

function validate_edit(obj) {
    var dataType = obj.attr('dataType');
    var minLen = obj.attr('minLen');
    var maxLen = obj.attr('maxLen');
    var str = obj.val();

    if (dataType == null && minLen == null && maxLen == null) { return true; }

    if (dataType == "number" && (str.match(/[^0-9]/) || str == '')) { return false; }
    if (str.length < minLen || str.length > maxLen) { return false; }

    return true;
}

function serializeForm(obj) {
    var str = "";
    $(obj).find('input').each(function (data) {
        str += $(this).attr('id') + '=' + $(this).val() + '&';
    });
    return str;
}

function editClient(cid, json) {
    var clientInfo;
    try {
        clientInfo = eval('(' + json + ')');
    } catch (e) {
        messageBox('Ð’Ð½ÑƒÑ‚Ñ€ÐµÐ½Ð½ÑÑ Ð¾ÑˆÐ¸Ð±ÐºÐ°! ÐžÐ±Ñ€Ð°Ñ‚Ð¸Ñ‚ÐµÑÑŒ Ðº Ñ€Ð°Ð·Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸ÐºÑƒ! [' + json + ']');
        return;
    }
    if (!$('#editClientBox').is(':data(dialog)')) {
        $('#editClientBox').dialog({
            modal: true,
            autoOpen: false,
            buttons: {
                "Ð˜Ð·Ð¼ÐµÐ½Ð¸Ñ‚ÑŒ": function () {
                    messageBox(serializeForm('#editClientBox'));
                    $(this).dialog("close");
                    $('#clientSearchResults').dialog("close"); // data will be changed, so we'll need to search again
                },
                "ÐžÑ‚Ð¼ÐµÐ½Ð¸Ñ‚ÑŒ": function () {
                    $(this).dialog("close");
                }
            }
        });
    }
    $('#editClientBox_id').val(cid);
    $('#editClientBox_fio').val(clientInfo['fio']);
    $('#editClientBox_phone').val(clientInfo['phone']);
    $('#editClientBox_doc').val(clientInfo['doc']);
    $('#editClientBox_note').val(clientInfo['note']);
    $('#editClientBox').dialog("open");
}

function addClient() {
    if (!$('#addClientBox').is(':data(dialog)')) {
        $('#addClientBox').dialog({
            modal: true,
            autoOpen: false,
            buttons: {
                "Ð”Ð¾Ð±Ð°Ð²Ð¸Ñ‚ÑŒ": function () {
                    var values_ok = true;
                    $('#addClientBox').find('input').each(function (index) {
                        if (!validate_edit($(this))) {
                            values_ok = false;
                            $(this).css('background-Color', 'red');
                        } else {
                            $(this).css('background-Color', '');
                        }
                    });
                    if (!values_ok) {
                        $('#addClientBoxHint').html('Ð’Ð²ÐµÐ´ÐµÐ½Ñ‹ Ð½ÐµÐ²ÐµÑ€Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ');
                    } else {
                        $(this).dialog("close");
                        waitBox('ÐŸÐ¾Ð´Ð¾Ð¶Ð´Ð¸Ñ‚Ðµ - Ñ€ÐµÐ³Ð¸ÑÑ‚Ñ€Ð°Ñ†Ð¸Ñ Ð½Ð¾Ð²Ð¾Ð³Ð¾ ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð°...');
                    /*    $.ajax({ type: 'POST', url: 'support.php', timeout: 10000,
                            data: 'cmd=addClient&' + serializeForm('#addClientBox'),
                            success: function (data) {
                                unwaitBox();
                                if (data.match(/^OK/)) {
                                    messageBox('ÐšÐ»Ð¸ÐµÐ½Ñ‚ Ð·Ð°Ñ€ÐµÐ³Ð¸ÑÑ‚Ñ€Ð¸Ñ€Ð¾Ð²Ð°Ð½');
                                } else {
                                    messageBox('ÐžÑˆÐ¸Ð±ÐºÐ°' + data);
                                }
                            },
                            error: function () {
                                unwaitBox();
                                messageBox('ÐžÑˆÐ¸Ð±ÐºÐ° Ð¿Ñ€Ð¸ Ð¿Ð¾Ð¿Ñ‹Ñ‚ÐºÐµ ÑÐ²ÑÐ·Ð°Ñ‚ÑŒÑÑ Ñ ÑÐµÑ€Ð²ÐµÑ€Ð¾Ð¼ - Ð¿Ð¾Ð¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ ÐµÑ‰Ðµ Ñ€Ð°Ð·');
                            }
                        });*/
                    }
                },
                "ÐžÑ‚Ð¼ÐµÐ½Ð¸Ñ‚ÑŒ": function () {
                    $(this).dialog("close");
                }
            }
        });
        $('#addClientBox').find('input').keyup(function () {
            if (validate_edit($(this))) {
                $(this).css('background-Color', '');
            } else {
                $(this).css('background-Color', 'red');
            }
        });
    }
    $('#addClientBox').dialog("open");
    $('#addClientBox').find('input').attr('background-Color', '').val('')[0].focus();
}

var 
	showGamesTimeout;
var window2close = false;

function showGames(event_id, event_name, recall) {
    var callMyself = 'showGames(' + event_id + ', "' + event_name + '", 1)';

    clearTimeout(showGamesTimeout);
    if (recall == 1 && window2close) { return; }
    if (recall == 0) { window2close = false; }

    if ($("#gamesDisplayBox").length == 0) {
        $('body').append('<div id="gamesDisplayBox" class="gamesDialog"></div>');
        $('#gamesDisplayBox').dialog({
            modal: true,
            autoOpen: false,
            width: 600,
            maxHeight: 500,
            beforeclose: function () { clearTimeout(showGamesTimeout); window2close = true; },
            buttons: {
                "Ð¥Ð¾Ñ€Ð¾ÑˆÐ¾": function () { $(this).dialog("close"); window2close = true; clearTimeout(showGamesTimeout); }
            }
        });
    }

    // following code searches live events currently displayed and takes score's value
    var tmpList = $('td.eventScore');
    for (var i = 0; i < tmpList.length; i++)
        if ($(tmpList[i]).attr('eventName') == event_name) {
            // this is our event!
            event_name = event_name + " -- <font color=\"#ffffff\">" + $(tmpList[i]).html() + "</font>";
            break;
        }
    $('#gamesDisplayBox').dialog("option", "title", event_name);

    if (recall == 0) {
        waitBox("Ð—Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ñ‹Ñ… Ð¸Ð³Ñ€ Ð¿Ð¾ ÑÐ¾Ð±Ñ‹Ñ‚Ð¸ÑŽ");
    }
   /* $.ajax({ type: 'POST', url: 'supportGG.php?', data: 'cmd=getGames&event_id=' + event_id, timeout: 20000,
        success: function (data) {
            if (window2close) { return; }
            unwaitBox();
            try {
                var games = eval('(' + data + ')');
                var gamesTrTemplate = '<tr><td active=":active" parsable=":parsable" style="border-bottom:1px dashed darkgrey;">:nameRU</td>';
                var resultsTemplate = '<tr class="resultRow" RID=":id"><td class="xtooltipx" tip="Ð¿Ñ€ÐµÐ´Ñ‹Ð´ÑƒÑ‰ÐµÐµ Ð·Ð½Ð°Ñ‡Ð½Ð¸Ðµ :odd1">:nameRU</td><td  class="xtooltipx" tip="Ð¿Ñ€ÐµÐ´Ñ‹Ð´ÑƒÑ‰ÐµÐµ Ð·Ð½Ð°Ñ‡Ð½Ð¸Ðµ :odd1" align="right">:odd0<span class="indy" o0=":odd0" o1=":odd1"></span></td></tr>';
                var content = "";
                var count = 0;
                for (var game in games) {
                    var results = "";
                    if (games[game]["active"] == 1 && games[game]["parsable"] == 1) {
                        for (var result in games[game]["results"]) {
                            results += processTemplate(resultsTemplate, games[game]["results"][result]);
                        }
                    } else {
                        if (games[game]["parsable"] == 0) {
                            message = 'Ð¿Ñ€Ð¸ÐµÐ¼ ÑÑ‚Ð°Ð²Ð¾Ðº Ð½ÐµÐ²Ð¾Ð·Ð¼Ð¾Ð¶ÐµÐ½';
                        }
                        if (games[game]["active"] == 0) {
                            message = 'Ð¿Ñ€Ð¸ÐµÐ¼ ÑÑ‚Ð°Ð²Ð¾Ðº Ð¿Ñ€Ð¸Ð¾ÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½';
                        }
                        results += '<tr><td>' + message + '</td></tr>';
                    }
                    content += processTemplate(gamesTrTemplate, games[game]) +
							'<td style="border-bottom:1px dashed darkgrey;"><table class="gamesDialog" width="100%">' + results + "</table></td></tr>";
                    count++;
                }
                if (count == 0) {
                    content = 'Ð”Ð»Ñ Ð´Ð°Ð½Ð½Ð¾Ð³Ð¾ ÑÐ¾Ð±Ñ‹Ñ‚Ð¸Ñ Ð½ÐµÑ‚ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ñ‹Ñ… Ð¸Ð³Ñ€';
                } else {
                    content = '<table class="gamesDialog" width="100%">' + content + '</table>';
                }
                $('#gamesDisplayBox').html('<div style="max-height:450px;">' + content + '</div>').dialog("open");
                // leading dogowners suggesting to sqling only active games...
                $('#gamesDisplayBox').find('td').each(function (index) {
                    if ($(this).attr('active') == 0 || $(this).attr('parsable') == 0) {
                        $(this).css('color', '#7f7f7f');
                    }
                });
                $('.indy').each(function (index) {
                    var o0 = $(this).attr('o0');
                    var o1 = $(this).attr('o1');
                    if (o0 > o1) {
                        $(this).html('â–²');
                        $(this).css('color', '#00ff00');
                    }
                    if (o0 < o1) {
                        $(this).html('â–¼');
                        $(this).css('color', '#ff0000');
                    }
                    if (o0 == o1 || o1 == 0) {
                        $(this).html('â–¼').css('color', '#ffffff');
                    }
                });
                showGamesTimeout = setTimeout(callMyself, 1000);
            } catch (e) {
                //messageBox('Ð’Ð½ÑƒÑ‚Ñ€ÐµÐ½Ð½ÑÑ Ð¾ÑˆÐ¸Ð±ÐºÐ° - Ð¾Ð±Ñ€Ð°Ñ‚Ð¸Ñ‚ÐµÑÑŒ Ðº Ñ€Ð°Ð·Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸ÐºÑƒ');
                showGamesTimeout = setTimeout(callMyself, 1000);
            }
        },
        error: function () {
            if (window2close) return;
            unwaitBox();
            //messageBox("ÐžÑˆÐ¸Ð±ÐºÐ° ÑÐ²ÑÐ·Ð¸ Ñ ÑÐµÑ€Ð²ÐµÑ€Ð¾Ð¼ - Ð¿Ð¾Ð¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ ÐµÑ‰Ðµ Ñ€Ð°Ð·!");
            showGamesTimeout = setTimeout(callMyself, 1000);
        }
    });*/
}

var 
	slipUpdateTimeout = null;
function slipUpdate() {
    if ($('#SlipTable').find('tr.slipRow').length == 0) {
        $('#SlipBox').dialog("close");
    }
    $('#SlipTable').find('tr.slipRow').each(function (index) {
      /*  $.ajax({ type: 'POST', url: 'support.php', data: 'cmd=getRIDDetails&rid=' + $(this).attr('rid'), timeout: 10000,
            success: function (data) {
                // just getting details...
                // we hope to get json:
                // rid:'', nameRU:'', odd0:'' ...:)
                // $(this).html("<td>"+data+"</td>");
                try {
                    var result = eval('(' + data + ')');
                    var totalRows = 0;
                    var rowsRemoved = 0;
                    $('#SlipTable').find('tr.slipRow').each(function () {
                        totalRows++;
                        if ($(this).attr('rid') == result["id"]) {
                            $(this).attr('eid', result["xevent_id"]);
                            $(this).attr('sleepTime', result["sleepTime"]);
                            var maxBet = 0; maxBet = Math.round(3500 / (result["odd0"] - 1));
                            if ($('#ridOdd' + result['id']).length == 0) {
                                $(this).html('<td>' + result["eventNameRU"] + "</td><td>" + result["gameNameRU"] + "</td><td>" + result["nameRU"] + '</td><td id="ridOdd' + result['id'] + '" align="right">' + result["odd0"] + '</td><td><input class="slipBetValueInput" type="text" style="text-align:center;" id="betValue' + result["id"] + '" value="0" size="5" rid="' + result["id"] + '"></td><td align="right" rid="' + result["id"] + '" id="possibleWin' + result["id"] + '">0<b>RUR</b></td><td><span class="ridRemove ui-icon ui-icon-closethick" unselectable="on" style="-moz-user-select: none;">close</span></td><td>ÐœÐ¡:<span id="maxBet' + result["id"] + '">' + maxBet + '</span></td>');
                                $('#' + "betValue" + result["id"]).focus();
                            } else {
                                $('#ridOdd' + result['id']).html(result["odd0"]);
                                $('#maxBet' + result['id']).html(maxBet);
                                $('#betValue' + result["id"]).trigger("keyup"); // if odd0 is now different, toggling keypress...
                            }
                            if (result["active"] == 0 || result["seenNow"] == 0) {
                                $(this).remove();
                                rowsRemoved++;
                                switchExpressOff();
                            }
                        }
                    });
                    if (totalRows == rowsRemoved) {
                        // no entries in slip left... just closing slip
                        $('#SlipBox').dialog("close");
                    }
                    $('#expressAmountOdd').html(calculateExpressOdd());
                } catch (e) {
                    messageBox("ÐžÑˆÐ¸Ð±ÐºÐ° Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ Ð´Ð°Ð½Ð½Ñ‹Ñ… - Ð¾Ð±Ñ€Ð°Ñ‚Ð¸Ñ‚ÐµÑÑŒ Ðº Ñ€Ð°Ð·Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸ÐºÑƒ, " + data);
                }
            },
            error: function () {
                // failed to get details...
                messageBox("ÐžÑˆÐ¸Ð±ÐºÐ° Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ Ð´Ð°Ð½Ð½Ñ‹Ñ… - Ð¿Ð¾Ð¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ ÐµÑ‰Ðµ Ñ€Ð°Ð·.");
            }
        });*/
    });
    if (slipUpdateTimeout != null) {
        clearTimeout(slipUpdateTimeout);
    }
    slipUpdateTimeout = setTimeout(function () {
        slipUpdate();
    }, 2000);
}
function slipGetClient(clientid) {
   /* $.ajax({ type: 'POST', url: 'support.php', data: 'cmd=slipGetClient&clientid=' + clientid, timeout: 10000,
        success: function (data) {
            try {
                var clientInfo = eval('(' + data + ')');
                if (clientInfo.length == 0 || clientInfo.length > 1) {
                    $('#slipClientCard').html('Ð£ÐºÐ°Ð·Ð°Ð½Ð½Ð°Ñ ÐºÐ°Ñ€Ñ‚Ð° ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð° Ð½Ðµ Ð·Ð°Ñ€ÐµÐ³Ð¸ÑÑ‚Ñ€Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð°...');
                } else {
                    $('#slipClientCard').html("[" + clientInfo[0]["fio"] + " " + clientInfo[0]["note"] + "]");
                }
            } catch (e) {
                messageBox('ÐžÑˆÐ¸Ð±ÐºÐ° Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ¸ ÐºÐ°Ñ€Ñ‚Ñ‹ ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð° Ñ ÑÐµÑ€Ð²ÐµÑ€Ð° [' + data + '] - Ð¾Ð±Ñ€Ð°Ñ‚Ð¸Ñ‚ÐµÑÑŒ Ðº Ñ€Ð°Ð·Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸ÐºÑƒ.')
            }
        },
        error: function () {
            messageBox('ÐžÑˆÐ¸Ð±ÐºÐ° Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ¸ ÐºÐ°Ñ€Ñ‚Ñ‹ ÐºÐ»Ð¸ÐµÐ½Ñ‚Ñ‹...');
        }
    });*/
}
var 
	expressIsOn = 0;
function switchExpressOn() {
    expressIsOn = 1;
    $('#expressAmountP').show();
    $('#expressAmountI').val('0');
    $('#expressAmountOdd').html(calculateExpressOdd());
    $('#expressAmountWin').html(calculateExpressWin());
    $('#expressMaxBet').html(calculateExpressMaxBet());
    $('#SlipTable').find('tr.slipRow').each(function (index) {
        var rid = $(this).attr('rid');
        $('#betValue' + rid).val('0').attr('disabled', 'disabled');
    });
}
function switchExpressOff() {
    expressIsOn = 0;
    $('#expressAmountP').hide();
    $('#expressAmountI').val('0');
    $('#expressAmountOdd').html('&nbsp;');
    $('#SlipTable').find('tr.slipRow').each(function (index) {
        var rid = $(this).attr('rid');
        $('#betValue' + rid).val('0').attr('disabled', '');
    });
}
function roundNumber(num, dec) {
    var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    return result;
}
function calculateExpressMaxBet() {
    return Math.round(4500 / (calculateExpressOdd() - 1));
}
function calculateExpressOdd() {
    var expressOdd = 1;
    $('#SlipTable').find('tr.slipRow').each(function (index) {
        var rid = $(this).attr('rid');
        var oddV = $('#ridOdd' + rid).html();
        expressOdd *= oddV;
    });
    return roundNumber(expressOdd, 3);
}
function calculateExpressWin() {
    var expressOdd = calculateExpressOdd();
    var expressAmount = $('#expressAmountI').val();
    if (expressAmount.match(/^[0-9.,]+$/)) {
        return roundNumber(expressAmount * expressOdd, 3);
    }
    return 0;
}
var slipCancelStatus = 0;
function addResult2Slip(resultobject) {
    if ($('#SlipBox').length == 0) {
        $('body').append('<div id="SlipBox" title="' + getMyName() + '::ÐºÑƒÐ¿Ð¾Ð½"><table id="SlipTable" class="resultsDialog" width="100%"></table><p id="expressAmountP" style="display:none;font-size:11px;">Ð¡Ñ‚Ð°Ð²ÐºÐ° Ð½Ð° ÑÐºÑÐ¿Ñ€ÐµÑÑ: <input type=text size=5 id="expressAmountI" style="font-size:11px; text-align:center;">&nbsp;&nbsp;&nbsp;ÐœÐ½Ð¾Ð¶Ð¸Ñ‚ÐµÐ»ÑŒ: <span id="expressAmountOdd">&nbsp;</span>&nbsp;&nbsp;&nbsp;ÐžÐ¶Ð¸Ð´Ð°ÐµÐ¼Ð°Ñ Ð²Ñ‹Ð¿Ð»Ð°Ñ‚Ð°: <span id="expressAmountWin">&nbsp;</span><b>RUR</b>&nbsp;&nbsp;&nbsp;ÐœÐ¡: <span id="expressMaxBet">&nbsp;</span><b>RUR</b></p><p style="font-size:11px;">ÐšÐ°Ñ€Ñ‚Ð° ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð°&nbsp;&nbsp;&nbsp;<input id="slipClientCardEdit" value="" type="text" size="5" style="font-size:11px; text-align:center;">&nbsp;&nbsp;&nbsp;<span id="slipClientCard"></span></p></div>');
        $('#expressAmountI').keyup(function () {
            $('#expressAmountWin').html(calculateExpressWin());
            $('#expressMaxBet').html(calculateExpressMaxBet());
        });
        $('#SlipBox').dialog({
            modal: false,
            autoOpen: false,
            width: 650,
            buttons: {
                "Ð­ÐºÑÐ¿Ñ€ÐµÑÑ": function () {
                    if (expressIsOn == 1) {
                        switchExpressOff();
                    } else {
                        var rowCount = 0;
                        var eventList = new Array();
                        var sameEvents = 0;
                        $('#SlipTable').find('tr.slipRow').each(function (index) {
                            rowCount++;
                            if (eventList[$(this).attr('eid')] != null) {
                                eventList[$(this).attr('eid')] = eventList[$(this).attr('eid')] + 1;
                                sameEvents = 1;
                            } else {
                                eventList[$(this).attr('eid')] = 1;
                            }
                        });
                        if (rowCount == 1 || sameEvents == 1) {
                            messageBox('Ð¡Ñ‚Ð°Ð²ÐºÐ¸ Ñ‚Ð¸Ð¿Ð° "Ð­ÐºÑÐ¿Ñ€ÐµÑÑ" Ð½ÐµÐ²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ñ‹ Ð´Ð»Ñ Ð²Ñ‹Ð±Ñ€Ð°Ð½Ð½Ñ‹Ñ… Ð¸Ð³Ñ€ Ð¸Ð»Ð¸ ÑÐ¾Ð±Ñ‹Ñ‚Ð¸Ð¹');
                        } else {
                            // right here we know, that express bet can be defined
                            switchExpressOn();
                        }
                    }
                },
                "Ð’Ñ‹Ð¿Ð¸ÑÐ°Ñ‚ÑŒ Ñ‡ÐµÐº": function () {
                    // checking pre-requisites, all values must be positive numbers.
                    var valuesOkay = true;
                    var slipText = '';
                    var expressSlipText = '';
                    var oddList = '';
                    var niceOddList = '';
                    $('#SlipTable').find('tr.slipRow').each(function (index) {
                        var rid = $(this).attr('rid');
                        var bv = $('#betValue' + rid).val();
                        if (bv > 0 && !bv.match(/[^0-9]/)) {
                            // value is okay
                            slipText += rid + ":" + bv + ",";
                        } else {
                            // wrong value...
                            valuesOkay = false;
                        }
                        if (expressIsOn) {
                            expressSlipText += rid + ",";
                        }
                        var oddV = $('#ridOdd' + rid).html();
                        if (oddV > 0) {
                            oddList += rid + ":" + oddV + ",";
                            niceOddList += '<b>' + oddV + '</b>, '
                        } else {
                            valuesOkay = false;
                        }
                    });
                    if (valuesOkay && expressIsOn == 0) {
                        $('#gamesDisplayBox').dialog("close");
                        slipCancelStatus = 0;
                        var sleepMax = 0; $('.slipRow').each(function (idx, obj) { if (parseInt($(obj).attr("sleepTime")) >= sleepMax) { sleepMax = $(obj).attr("sleepTime"); } });
                        waitBox('<center>ÐŸÐ¾Ð´Ð¾Ð¶Ð´Ð¸Ñ‚Ðµ, Ð¸Ð´ÐµÑ‚ Ñ€ÐµÐ³Ð¸ÑÑ‚Ñ€Ð°Ñ†Ð¸Ñ ÑÑ‚Ð°Ð²ÐºÐ¸...(' + sleepMax + ')<br><img src="Clock.gif" width=85 height=85></center>' + niceOddList + '<br><center><input id="slipCancelButton" type="button" value="ÐžÑ‚ÐºÐ°Ð·Ð°Ñ‚ÑŒÑÑ!!!"></center>');
                        setTimeout(function () {
                            // collecting information once again...
                            if (slipCancelStatus == 1) {
                                unwaitBox();
                                messageBox('Ð¡Ñ‚Ð°Ð²ÐºÐ° Ð¾Ñ‚Ð¼ÐµÐ½ÐµÐ½Ð° Ð¸ Ð½Ðµ Ð±ÑƒÐ´ÐµÑ‚ Ð·Ð°Ñ€ÐµÐ³Ð¸ÑÑ‚Ñ€Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð°!');
                            } else {
                                var oddListN = '';
                                var slipTextN = '';
                                $('#SlipTable').find('tr.slipRow').each(function (index) {
                                    var rid = $(this).attr('rid');
                                    var bv = $('#betValue' + rid).val();
                                    if (bv > 0 && !bv.match(/[^0-9]/)) {
                                        // value is okay
                                        slipTextN += rid + ":" + bv + ",";
                                    } else {
                                        // wrong value...
                                        valuesOkay = false;
                                    }
                                    var oddV = $('#ridOdd' + rid).html();
                                    if (oddV > 0) {
                                        oddListN += rid + ":" + oddV + ",";
                                    } else {
                                        valuesOkay = false;
                                    }
                                });
                                $('#SlipBox').dialog("close");
                                unwaitBox();
                                if (oddListN != oddList || slipTextN != slipText) {
                                    messageBox('ÐšÐ¾Ñ‚Ð¸Ñ€Ð¾Ð²ÐºÐ¸ Ð¸Ð·Ð¼ÐµÐ½Ð¸Ð»Ð¸ÑÑŒ! ÐŸÐ¾Ð¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ ÐµÑ‰Ðµ Ñ€Ð°Ð·.')
                                } else {
                                 //   window.open("mkSlip.php?slip=" + slipText + "&clientid=" + $('#slipClientCardEdit').val() + '&ol=' + oddList + "&token=" + Math.random());
                                }
                            }
                        }, sleepMax);
                    } else if (expressSlipText != '' && expressIsOn == 1 && $('#expressAmountI').val().match(/^[0-9.]+$/) && $('#expressAmountI').val() > 0) {
                        // express betting selected...:)
                        $('#gamesDisplayBox').dialog("close");
                        waitBox('<center>ÐŸÐ¾Ð´Ð¾Ð¶Ð´Ð¸Ñ‚Ðµ, Ð¸Ð´ÐµÑ‚ Ñ€ÐµÐ³Ð¸ÑÑ‚Ñ€Ð°Ñ†Ð¸Ñ ÑÑ‚Ð°Ð²ÐºÐ¸...<br><img src="Clock.gif" width=85 height=85></center>');
                        setTimeout(function () {
                            // collecting information once again...
                            var oddListN = '';
                            var expressSlipTextN = '';
                            $('#SlipTable').find('tr.slipRow').each(function (index) {
                                var rid = $(this).attr('rid');
                                expressSlipTextN += rid + ",";
                                var oddV = $('#ridOdd' + rid).html();
                                if (oddV > 0) {
                                    oddListN += rid + ":" + oddV + ",";
                                } else {
                                    valuesOkay = false;
                                }
                            });
                            $('#SlipBox').dialog("close");
                            unwaitBox();
                            if (oddListN != oddList || expressSlipTextN != expressSlipText) {
                                messageBox('ÐšÐ¾Ñ‚Ð¸Ñ€Ð¾Ð²ÐºÐ¸ Ð¸Ð·Ð¼ÐµÐ½Ð¸Ð»Ð¸ÑÑŒ! ÐŸÐ¾Ð¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ ÐµÑ‰Ðµ Ñ€Ð°Ð·.')
                            } else {
                               // window.open("mkSlipE.php?slip=" + expressSlipText + "&clientid=" + $('#slipClientCardEdit').val() + '&amount=' + $('#expressAmountI').val() + "&token=" + Math.random());
                            }
                        }, sleepMax);
                    } else {
                        messageBox('Ð’Ð²ÐµÐ´ÐµÐ½Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð½ÐµÐ²ÐµÑ€Ð½Ñ‹.');
                    }
                },
                "ÐžÑ‚Ð¼ÐµÐ½Ð¸Ñ‚ÑŒ Ð²Ñ‹Ð±Ð¾Ñ€": function () {
                    $(this).dialog("close");
                }
            },
            beforeclose: function () {
                $('#SlipTable').find('tr.slipRow').remove();
                clearTimeout(slipUpdateTimeout);
                slipUpdateTimeout = null;
            }
        });
    }
    $('#SlipBox').dialog("open");
    switchExpressOff();
    $('#slipClientCardEdit').val('');
    $('#slipClientCard').html('');
    var alreadyIn = false;
    $('#SlipTable').find('tr.slipRow').each(function (index) {
        if ($(this).attr('rid') == $(resultobject).attr('rid')) {
            alreadyIn = true;
        }
    });
    if (!alreadyIn) {
        $('#SlipTable').append('<tr class="slipRow" rid="' + $(resultobject).attr('rid') + '"><td>' + $(resultobject).attr('rid') + '</td></tr>');
    }
    slipUpdate();
}

function showMessages(event_id, event_name) {
    if ($("#messagesDisplayBox").length == 0) {
        $('body').append('<div id="messagesDisplayBox" title="' + getMyName() + '::Ñ‚Ñ€Ð°Ð½ÑÐ»ÑÑ†Ð¸Ñ" class="messagesDialog"></div>');
        $("#messagesDisplayBox").dialog({
            modal: true,
            autoOpen: false,
            width: 600,
            maxHeight: 500,
            buttons: {
                "Ð¥Ð¾Ñ€Ð¾ÑˆÐ¾": function () { $(this).dialog("close"); }
            }
        });
    }
    waitBox("Ð—Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° Ñ‚ÐµÐºÑÑ‚Ð¾Ð²Ð¾Ð¹ Ñ‚Ñ€Ð°Ð½ÑÐ»ÑÑ†Ð¸Ð¸ Ñ ÑÐµÑ€Ð²ÐµÑ€Ð° - Ð¿Ð¾Ð´Ð¾Ð¶Ð´Ð¸Ñ‚Ðµ");
    $('#messagesDisplayBox').dialog("option", "title", event_name);
   /* $.ajax({ type: 'POST', url: 'support.php', data: 'cmd=getMessages&event_id=' + event_id, timeout: 10000,
        success: function (data) {
            unwaitBox();
            try {
                var messages = eval("(" + data + ")");
                var messagesTrTemplate = '<tr><td align="center">:ordinal</td><td>:message</td><td align="center">:gameTimer</td></tr>';
                var content = "";
                var count = 0;
                for (var msg in messages) {
                    content += processTemplate(messagesTrTemplate, messages[msg]);
                    count++;
                }
                if (count == 0) {
                    content = "<tr><td>Ð¡Ð¾Ð±Ñ‹Ñ‚Ð¸Ðµ ÐµÑ‰Ðµ Ð½Ðµ Ð½Ð°Ñ‡Ð°Ð»Ð¾ÑÑŒ</td></tr>";
                } else {
                    content = "<tr><th>â„–ÑÐ¾Ð¾Ð±Ñ‰ÐµÐ½Ð¸Ñ</th><th>ÑÐ¾Ð¾Ð±Ñ‰ÐµÐ½Ð¸Ðµ</th><th>Ð¸Ð³Ñ€Ð¾Ð²Ð¾Ðµ Ð²Ñ€ÐµÐ¼Ñ</th></tr>" +
						content;
                }
                content = '<center><table class="messagesDialog">' + content + "</table></center>";
                $('#messagesDisplayBox').html('<div style="max-height:450px;">' + content + '</div>').dialog("open");
            } catch (e) {
                messageBox("Ð’Ð½ÑƒÑ‚Ñ€ÐµÐ½Ð½ÑÑ Ð¾ÑˆÐ¸Ð±ÐºÐ° - ÑÐ²ÑÐ¶Ð¸Ñ‚ÐµÑÑŒ Ñ Ñ€Ð°Ð·Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸ÐºÐ¾Ð¼");
            }
        },
        error: function () {
            unwaitBox();
            messageBox("ÐžÑˆÐ¸Ð±ÐºÐ° ÑÐ²ÑÐ·Ð¸ Ñ ÑÐµÑ€Ð²ÐµÑ€Ð¾Ð¼ - Ð¿Ð¾Ð¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ ÐµÑ‰Ðµ Ñ€Ð°Ð·");
        }
    });*/
}

function confirmAction(info, action) {
    if (!$('#confirmBox').is(':data(dialog)')) {
        if ($('#confirmBox').length == 0) {
            $('body').append('<div id="confirmBox" title="' + getMyName() + '" style="display:none"></div>');
        }
        $('#confirmBox').html(info);
        $('#confirmBox').dialog({
            modal: true,
            autoOpen: true,
            buttons: {
                "Ð”Ð°": function () {
                    $('#confirmBox').dialog("destroy");
                    action(); 	// doing action!!! whatever it is...
                },
                "ÐžÑ‚Ð¼ÐµÐ½Ð¸Ñ‚ÑŒ": function () {
                    $('#confirmBox').dialog("destroy");
                }
            },
            beforeclose: function () {
                $(this).dialog("destroy");
            }
        });
        $('#confirmBox').parent().keyup(function (e) {
            if (e.keyCode == 13) {
                $('#confirmBox').parent().find('button:contains(Ð”Ð°)').trigger('click');
            }
        });
    } else {
        messageBox('Ð’Ð½ÑƒÑ‚Ñ€ÐµÐ½Ð½ÑÑ Ð¾ÑˆÐ¸Ð±ÐºÐ° ÑÐ¸ÑÑ‚ÐµÐ¼Ñ‹ - Ð¾Ð±Ñ€Ð°Ñ‚Ð¸Ñ‚ÐµÑÑŒ Ðº Ñ€Ð°Ð·Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸ÐºÑƒ');
    }
}
/*
function roundNumber(num, dec) {
var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
return result;
}
*/

function showDetailedSlip(slipid) {
    waitBox('Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° Ð±Ð¸Ð»ÐµÑ‚Ð°...');
   /* $.ajax({ type: 'POST', url: 'support.php', data: 'cmd=getSlipDetails&slipid=' + slipid, timeout: 10000,
        success: function (data) {
            unwaitBox();
            messageBox(data);
        },
        error: function () {
            unwaitBox();
            messageBox('ÐžÑˆÐ¸Ð±ÐºÐ° ÑÐ²ÑÐ·Ð¸ Ñ ÑÐµÑ€Ð²ÐµÑ€Ð¾Ð¼ - Ð¿Ð¾Ð¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ ÐµÑ‰Ðµ Ñ€Ð°Ð·');
        }
    });*/
}

function currentReport() {
    if ($('#reportBox').length == 0) {
        $('body').append('<div id="reportBox" title="' + getMyName() + '::Ñ‚ÐµÐºÑƒÑ‰Ð¸Ð¹ Ð¾Ñ‚Ñ‡ÐµÑ‚"><table cellspacing=0 cellpadding=0 border=0 style="font-family:Verdana, sans-serif; font-size:12px"><tr><td>Ð”Ð°Ñ‚Ð° Ð½Ð°Ñ‡Ð°Ð»Ð° Ð¾Ñ‚Ñ‡ÐµÑ‚Ð°:</td><td><input type="text" id="reportDate"></td><td>&nbsp;</td><td>Ð”Ð°Ñ‚Ð° Ð¾ÐºÐ¾Ð½Ñ‡Ð°Ð½Ð¸Ñ Ð¾Ñ‚Ñ‡ÐµÑ‚Ð°:</td><td><input type="text" id="reportDate2"></td><td>&nbsp;</td><td><input type="button" id="showCurrentReport" value="ÐŸÐ¾ÐºÐ°Ð·Ð°Ñ‚ÑŒ"></td></tr></table><div id="currentReportData" style="max-height:450px;width:100%;"></div></div>');
        $('#reportBox').dialog({
            modal: true,
            autoOpen: false,
            width: 800,
            buttons: {
                "Ð¥Ð¾Ñ€Ð¾ÑˆÐ¾": function () {
                    $(this).dialog("close");
                }
            }
        });
        $('#reportDate').datepicker({ monthNames: ['Ð¯Ð½Ð²Ð°Ñ€ÑŒ', 'Ð¤ÐµÐ²Ñ€Ð°Ð»ÑŒ', 'ÐœÐ°Ñ€Ñ‚', 'ÐÐ¿Ñ€ÐµÐ»ÑŒ', 'ÐœÐ°Ð¹', 'Ð˜ÑŽÐ½ÑŒ', 'Ð˜ÑŽÐ»ÑŒ', 'ÐÐ²Ð³ÑƒÑÑ‚', 'Ð¡ÐµÐ½Ñ‚ÑÐ±Ñ€ÑŒ', 'ÐžÐºÑ‚ÑÐ±Ñ€ÑŒ', 'ÐÐ¾ÑÐ±Ñ€ÑŒ', 'Ð”ÐµÐºÐ°Ð±Ñ€ÑŒ'], dayNamesMin: ['Ð’Ñ', 'ÐŸÐ½', 'Ð’Ñ‚', 'Ð¡Ñ€', 'Ð§Ñ‚', 'ÐŸÑ‚', 'Ð¡Ð±'], firstDay: 1 });
        $('#reportDate').datepicker('option', 'dateFormat', 'dd.mm.yy');
        $('#reportDate2').datepicker({ monthNames: ['Ð¯Ð½Ð²Ð°Ñ€ÑŒ', 'Ð¤ÐµÐ²Ñ€Ð°Ð»ÑŒ', 'ÐœÐ°Ñ€Ñ‚', 'ÐÐ¿Ñ€ÐµÐ»ÑŒ', 'ÐœÐ°Ð¹', 'Ð˜ÑŽÐ½ÑŒ', 'Ð˜ÑŽÐ»ÑŒ', 'ÐÐ²Ð³ÑƒÑÑ‚', 'Ð¡ÐµÐ½Ñ‚ÑÐ±Ñ€ÑŒ', 'ÐžÐºÑ‚ÑÐ±Ñ€ÑŒ', 'ÐÐ¾ÑÐ±Ñ€ÑŒ', 'Ð”ÐµÐºÐ°Ð±Ñ€ÑŒ'], dayNamesMin: ['Ð’Ñ', 'ÐŸÐ½', 'Ð’Ñ‚', 'Ð¡Ñ€', 'Ð§Ñ‚', 'ÐŸÑ‚', 'Ð¡Ð±'], firstDay: 1 });
        $('#reportDate2').datepicker('option', 'dateFormat', 'dd.mm.yy');
        var today = new Date();
        var dayOfMonth = today.getDate();
        if (dayOfMonth < 10) dayOfMonth = "0" + dayOfMonth;
        var month = today.getMonth() + 1;
        if (month < 10) month = "0" + month;
        var year = today.getFullYear();
        $('#reportDate').val(dayOfMonth + '.' + month + '.' + year);
        $('#reportDate2').val(dayOfMonth + '.' + month + '.' + year);
        $('#showCurrentReport').click(function () {
            $(this).attr('disabled', 'disabled');
            var rd = $('#reportDate').val();
            var rd2 = $('#reportDate2').val();
            $('#currentReportData').html('<center>Ð˜Ð´ÐµÑ‚ Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° Ð¾Ñ‚Ñ‡ÐµÑ‚Ð°, Ð¿Ð¾Ð´Ð¾Ð¶Ð´Ð¸Ñ‚Ðµ Ð¿Ð¾Ð¶Ð°Ð»ÑƒÐ¹ÑÑ‚Ð°....<br><img src="images/ajax-loader.gif"></center>');
           /* $.ajax({ type: 'POST', url: 'support.php', data: 'cmd=getReportData&rd=' + rd + '&rd2=' + rd2, timeout: 60000,
                success: function (data) {
                    $('#showCurrentReport').attr('disabled', '');
                    try {
                        var report = eval('(' + data + ')');
                        var reportText = '';
                        var reportHeader = '<tr><th>Ð´Ð°Ñ‚Ð°</th><th>ÑÑ‚Ð°Ð²ÐºÐ°</th><th>Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ñ‹Ð¹ Ð²Ñ‹Ð¸Ð³Ñ€Ñ‹Ñˆ</th><th>Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚</th><th>ÐºÐ°ÑÑÐ¸Ñ€</th><th>ÐºÐ»Ð¸ÐµÐ½Ñ‚</th><th>Ð´Ð°Ñ‚Ð° Ð²Ñ‹Ð¿Ð»Ð°Ñ‚Ñ‹</th><th>ÑÑƒÐ¼Ð¼Ð° Ð²Ñ‹Ð¿Ð»Ð°Ñ‚Ñ‹</th><th>ÐºÐ°ÑÑÐ¸Ñ€</th></tr>';
                        var reportTemplate = '<tr class="reportedSlip :class" slipid=":id"><td>:stamp</td><td align="right">:betAmount<b>RUR</b></td><td align="right">:possibleWin<b>RUR</b></td><td align="right">:realWin</td><td align="center">:cashierName</td><td align="center">:clientName</td><td>:pay_stamp</td><td>:pay_amount</td><td>:pay_cashier</td></tr>';
                        var totals;
                        for (var row in report) {
                            if (report[row]['totals'] != 1) {
                                reportText += processTemplate(reportTemplate, report[row]);
                            } else {
                                totals = report[row];
                            }
                        }
                        var totalsTemplate = '<table style="font-size:11px; color:#000000"><tr><td>ÑÑ‚Ð°Ð²Ð¾Ðº Ð¿Ñ€Ð¸Ð½ÑÑ‚Ð¾</td><td>:StakesCount</td></tr>' +
										    '<tr><td>Ð½Ð° Ð¾Ð±Ñ‰ÑƒÑŽ ÑÑƒÐ¼Ð¼Ñƒ</td><td>:StakesAmount<b>RUR</b></td></tr>' +
										    '<tr><td>ÑÑƒÐ¼Ð¼Ð° ÑÐ¾Ð²ÐµÑ€ÑˆÐµÐ½Ð½Ñ‹Ñ… Ð²Ñ‹Ð¿Ð»Ð°Ñ‚</td><td>:StakesPayedAmount<b>RUR</b></td></tr>' +
										    '<tr><td>ÑÑƒÐ¼Ð¼Ð° Ðº Ð²Ñ‹Ð¿Ð»Ð°Ñ‚Ðµ</td><td>:Stakes2PayAmount<b>RUR</b></td></tr>' +
										    '<tr><td>Ð¾Ð¶Ð¸Ð´Ð°ÐµÐ¼Ð°Ñ ÑÑƒÐ¼Ð¼Ð° Ð²Ñ‹Ð¿Ð»Ð°Ñ‚</td><td>:Stakes2PayTheory<b>RUR</b></td></tr>' +
										    '</table>';
                        $('#currentReportData').html(processTemplate(totalsTemplate, totals) + '<table border=0 width="100%" style="font-size:11px; color:#000000;">' + reportHeader + reportText + '</table>');
                    } catch (e) {
                        messageBox('ÐžÑˆÐ¸Ð±ÐºÐ° Ð² Ð¾Ñ‚Ð²ÐµÑ‚Ðµ ÑÐµÑ€Ð²ÐµÑ€Ð° - Ð¾Ð±Ñ€Ð°Ñ‚Ð¸Ñ‚ÐµÑÑŒ Ðº Ñ€Ð°Ð·Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸ÐºÑƒ!' + data);
                    }
                },
                error: function () {
                    $('#showCurrentReport').attr('disabled', '');
                    messageBox('ÐžÑˆÐ¸Ð±ÐºÐ° ÑÐ²ÑÐ·Ð¸ Ñ ÑÐµÑ€Ð²ÐµÑ€Ð¾Ð¼ - Ð¿Ð¾Ð¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ ÐµÑ‰Ðµ Ñ€Ð°Ð·.')
                }
            });*/
        });
    }
    $('#showCurrentReport').trigger("click");
    $('#reportBox').dialog("open");
}

var 
	sellSeqTimer;
function confirmSellAction(info, action, amount) {
    if ($('#confirmSellBox').length == 0) {
        $('body').append('<div id="confirmSellBox" title="' + getMyName() + '" style="display:none"></div>');
    }
    $('#confirmSellBox').html(info);
    $('#confirmSellBox').dialog({
        modal: true,
        autoOpen: true,
        buttons: {
            "Ð¥Ð¾Ñ€Ð¾ÑˆÐ¾": function () {
                clearTimeout(sellSeqTimer);
                $('#confirmSellBox').dialog("destroy");
            },
            "Ð’Ñ‹ÐºÑƒÐ¿Ð¸Ñ‚ÑŒ": function () {
                clearTimeout(sellSeqTimer);
                $('#confirmSellBox').dialog("destroy");
                action(); 	// doing action!!! whatever it is...
            }
        },
        beforeclose: function () {
            $(this).dialog("destroy");
            clearTimeout(sellSeqTimer);
        }
    });
}
function sellBet(slipid) {
    unwaitBox();
   /* $.ajax({ type: 'POST', url: 'support.php', data: 'cmd=sellSlip&slipid=' + slipid, timeout: 10000,
        success: function (data) {
            if (data.match(/^OKAY/)) {
                messageBox('Ð¡Ñ‚Ð°Ð²ÐºÐ° ÑƒÑÐ¿ÐµÑˆÐ½Ð¾ Ð²Ñ‹ÐºÑƒÐ¿Ð»ÐµÐ½Ð°! Ð¦ÐµÐ½Ð° Ð²Ñ‹ÐºÑƒÐ¿Ð°: ' + data.split(":")[1]);
            } else {
                messageBox('ÐžÑˆÐ¸Ð±ÐºÐ° ÑÐ²ÑÐ·Ð¸ Ñ ÑÐµÑ€Ð²ÐµÑ€Ð¾Ð¼ - Ð¿Ð¾Ð¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ ÐµÑ‰Ðµ Ñ€Ð°Ð·!');
            }
        },
        error: function () {
            messageBox('ÐžÑˆÐ¸Ð±ÐºÐ° ÑÐ²ÑÐ·Ð¸ Ñ ÑÐµÑ€Ð²ÐµÑ€Ð¾Ð¼ - Ð¿Ð¾Ð¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ ÐµÑ‰Ðµ Ñ€Ð°Ð·!');
        }
    });*/
}
function startSellSeq(slipid) {
    clearTimeout(sellSeqTimer);
   /* $.ajax({ type: 'POST', url: 'sellBet.php?slipid=' + slipid, timeout: 10000,
        success: function (data) {
            if (data.match(/SELL/)) {
                lexx = data.split(":");
                confirmSellAction('Ð˜ÑÑ…Ð¾Ð´ ÐµÑ‰Ðµ Ð½Ðµ ÑƒÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½. Ð’Ð¾Ð·Ð¼Ð¾Ð¶ÐµÐ½ Ð¾Ð±Ñ€Ð°Ñ‚Ð½Ñ‹Ð¹ Ð²Ñ‹ÐºÑƒÐ¿ ÑÑ‚Ð°Ð²ÐºÐ¸ Ð·Ð° <b>' + Math.round(lexx[1]) + '</b>.', function () {
                    waitBox('<center>ÐŸÐ¾Ð´Ð¾Ð¶Ð´Ð¸Ñ‚Ðµ, Ð¸Ð´ÐµÑ‚ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ð²Ñ‹ÐºÑƒÐ¿Ð° ÑÑ‚Ð°Ð²ÐºÐ¸...<br><img src="Clock.gif" width=85 height=85></center>');
                    setTimeout(function () {
                        sellBet(slipid);
                    }, 7000);
                }, Math.round(lexx[1]));
            } else {
                confirmSellAction('Ð˜ÑÑ…Ð¾Ð´ ÐµÑ‰Ðµ Ð½Ðµ ÑƒÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½. ' + data, function () {
                    messageBox('ÐŸÐ¾ÐºÐ° Ð½ÐµÐ²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ Ð²Ñ‹ÐºÑƒÐ¿Ð¸Ñ‚ÑŒ Ð±Ð¸Ð»ÐµÑ‚ - Ð¿Ð¾Ð´Ð¾Ð¶Ð´Ð¸Ñ‚Ðµ...');
                }, 0);
            }
            sellSeqTimer = setTimeout(function () {
                startSellSeq(slipid);
            }, 3000);
        },
        error: function () {
            confirmSellAction('Ð˜ÑÑ…Ð¾Ð´ ÐµÑ‰Ðµ Ð½Ðµ ÑƒÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½. ÐžÑˆÐ¸Ð±ÐºÐ° ÑÐ²ÑÐ·Ð¸ Ñ ÑÐµÑ€Ð²ÐµÑ€Ð¾Ð¼ Ð¿Ñ€Ð¸ Ð·Ð°Ð¿Ñ€Ð¾ÑÐµ Ñ†ÐµÐ½Ñ‹ Ð²Ñ‹ÐºÑƒÐ¿Ð° - Ð¿Ð¾Ð¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ ÐµÑ‰Ðµ Ñ€Ð°Ð·!', function () {
                MessageBox('ÐŸÐ¾ÐºÐ° Ð½ÐµÐ²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ Ð²Ñ‹ÐºÑƒÐ¿Ð¸Ñ‚ÑŒ Ð±Ð¸Ð»ÐµÑ‚ - Ð¿Ð¾Ð´Ð¾Ð¶Ð´Ð¸Ñ‚Ðµ...');
            }, 0);
            sellSeqTimer = setTimeout(function () {
                startSellSeq(slipid);
            }, 3000);
        }
    });*/
}

function checkStake() {
    if ($('#checkStakeBox').length == 0) {
        $('body').append('<div id="checkStakeBox" title="' + getMyName() + '"><p style="text-size:11px; text-align:center;">Ð’Ð²ÐµÐ´Ð¸Ñ‚Ðµ Ð½Ð¾Ð¼ÐµÑ€ Ñ‡ÐµÐºÐ°<br><input id="checkStakeInput" type="text" size="15" style="text-align:center;"></p></div>');
        $('#checkStakeBox').dialog({
            modal: true,
            autoOpen: false,
            buttons: {
                "ÐÐ°Ð¹Ñ‚Ð¸": function () {
                    $(this).dialog("close");
                    var slipid = $('#checkStakeInput').val();
                    if (slipid != '' && !slipid.match(/[^0-9]/)) {
                        waitBox("ÐŸÐ¾Ð´Ð¾Ð¶Ð´Ð¸Ñ‚Ðµ, Ð¸Ð´ÐµÑ‚ Ð¿Ñ€Ð¾Ð²ÐµÑ€ÐºÐ° Ñ‡ÐµÐºÐ°...");
                      /*  $.ajax({ type: 'POST', url: 'support.php', data: 'cmd=checkStake&slipid=' + slipid, timeout: 10000,
                            success: function (data) {
                                unwaitBox();
                                if (data.match(/^OK/)) {
                                    var lexx = data.split(':');
                                    if (lexx[1] == 0) {
                                        messageBox('Ð¡Ñ‚Ð°Ð²ÐºÐ° Ð¿Ñ€Ð¾Ð¸Ð³Ñ€Ð°Ð»Ð°.' + data);
                                    } else {
                                        confirmAction('Ð¡Ñ‚Ð°Ð²ÐºÐ° Ð²Ñ‹Ð¸Ð³Ñ€Ñ‹Ð»Ð° <b style="color:#f00">' + lexx[1] + '</b>RUR, Ð²Ñ‹Ð¿Ð»Ð°Ñ‚Ð¸Ñ‚ÑŒ ÑÐµÐ¹Ñ‡Ð°Ñ?<br>' + lexx[2], function () {
                                            waitBox('ÐžÑÑƒÑ‰ÐµÑÑ‚Ð²Ð»ÑÐµÑ‚ÑÑ Ð²Ñ‹Ð¿Ð»Ð°Ñ‚Ð°.');
                                            $.ajax({ type: 'POST', url: 'support.php', data: 'cmd=fixPayment&slipid=' + slipid,
                                                timeout: 10000,
                                                success: function (data) {
                                                    unwaitBox();
                                                    if (data.match(/^OK/)) {
                                                        messageBox('Ð’Ñ‹Ð¿Ð»Ð°Ñ‚Ð° Ð·Ð°Ñ„Ð¸ÐºÑÐ¸Ñ€Ð¾Ð²Ð°Ð½Ð°: ' + data);
                                                    } else {
                                                        messageBox('ÐžÑˆÐ¸Ð±ÐºÐ° Ñ€ÐµÐ³Ð¸ÑÑ‚Ð°Ñ€Ñ†Ð¸Ð¸ Ð²Ñ‹Ð¿Ð»Ð°Ñ‚Ñ‹ - Ð¾Ð±Ñ€Ð°Ñ‚Ð¸Ñ‚ÐµÑÑŒ Ðº Ñ€Ð°Ð·Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸ÐºÑƒ. ' + data);
                                                    }
                                                },
                                                error: function () {
                                                    unwaitBox();
                                                    messageBox('ÐžÑˆÐ¸Ð±ÐºÐ° Ñ€ÐµÐ³Ð¸ÑÑ‚Ñ€Ð°Ñ†Ð¸Ð¸ Ð²Ñ‹Ð¿Ð»Ð°Ñ‚Ñ‹. ÐŸÐ¾Ð¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ ÐµÑ‰Ðµ Ñ€Ð°Ð·');
                                                }
                                            });
                                        });
                                    }
                                }
                                if (data.match(/^ERR:NONE/)) {
                                    messageBox('Ð§ÐµÐºÐ° Ñ ÑƒÐºÐ°Ð·Ð°Ð½Ð½Ñ‹Ð¼ Ð½Ð¾Ð¼ÐµÑ€Ð¾Ð¼ Ð½Ðµ Ð½Ð°Ð¹Ð´ÐµÐ½Ð¾.');
                                }
                                if (data.match(/^ERR:NOTREADY/)) {
                                    //messageBox('Ð˜ÑÑ…Ð¾Ð´ ÐµÑ‰Ðµ Ð½Ðµ ÑƒÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½.');
                                    startSellSeq(slipid);
                                }
                                if (data.match(/^ERR:NOAUTH/)) {
                                    messageBox('Ð’Ñ‹Ð¿Ð»Ð°Ñ‚Ð° Ð¿Ð¾ ÐºÐ°Ñ€Ñ‚Ð¾Ñ‡ÐºÐµ ÐµÑ‰Ðµ Ð°Ð²Ñ‚Ð¾Ñ€Ð¸Ð·Ð¾Ð²Ð°Ð½Ð° ÑÐ»ÑƒÐ¶Ð±Ð¾Ð¹ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚Ð¸. ÐÐ²Ñ‚Ð¾Ñ€Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð±Ñ‹Ð»Ð° Ð·Ð°Ñ‚Ñ€ÐµÐ±Ð¾Ð²Ð°Ð½Ð°, Ð¿Ñ€Ð¾Ð²ÐµÑ€ÑŒÑ‚Ðµ Ð¸ÑÑ…Ð¾Ð´ Ð¿Ð¾Ð·Ð¶Ðµ.');
                                }
                                if (data.match(/ERR:PAYED/)) {
                                    messageBox('Ð’Ñ‹Ð¸Ð³Ñ€Ñ‹Ñˆ ÑƒÐ¶Ðµ Ð²Ñ‹Ð¿Ð»Ð°Ñ‡ÐµÐ½');
                                }
                            },
                            error: function () {
                                unwaitBox();
                                messageBox('ÐžÑˆÐ¸Ð±ÐºÐ° ÑÐ²ÑÐ·Ð¸ Ñ ÑÐµÑ€Ð²ÐµÑ€Ð¾Ð¼ - Ð¿Ð¾Ð¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ ÐµÑ‰Ðµ Ñ€Ð°Ð·...');
                            }
                        });
        });*/
                    } else {
                        messageBox('ÐÐµÐ²ÐµÑ€Ð½Ñ‹Ð¹ Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚ Ð½Ð¾Ð¼ÐµÑ€Ð° Ñ‡ÐµÐºÐ°.');
                    }
                },
                "ÐžÑ‚Ð¼ÐµÐ½Ð¸Ñ‚ÑŒ": function () {
                    $(this).dialog("close");
                }
            }
        $('#checkStakeInput').keyup(function (event) {
            if (event.keyCode == '13') {
                $('#checkStakeBox').parent().find('button:contains(ÐÐ°Ð¹Ñ‚Ð¸)').trigger('click');
            }
        });
    }
    $('#checkStakeBox').dialog("open");
    $('#checkStakeInput').val('').focus();
}

var 
	eventSearchOnKeyPressTimeout;

//google.load("jquery", "1.4.4");
//google.load("jqueryui", "1.7.2");
//google.setOnLoadCallback(function() {
$(document).ready(function () {
    setTimeout('wallclock()', 1000);
    setTimeout('tickClock()', 3000);
    $('#slipCancelButton').live("click", function () {
        slipCancelStatus = 1;
        $(this).val('Ð¡Ñ‚Ð°Ð²ÐºÐ° Ð¾Ñ‚Ð¼ÐµÐ½ÑÐµÑ‚ÑÑ....');
    });
    showLogo('#logo', '' + getMyName() + ' Ð¢ÐµÑ…Ð¿Ð¾Ð´Ð´ÐµÑ€Ð¶ÐºÐ° v0.1.3');
    $('.tooltip').live("mouseover", function () { showTooltip($(this)); });
    $('.tooltip').live("mouseout", function () { hideTooltip(); });
    $('#hint').mouseover(function () { hideTooltip(); });
    $('#clientSearch').click(function () {
        searchClient();
    });
    $('#getSched').click(function () {
       // window.open("line.php");
    });
    $('#getRes').click(function () {
       // window.open("results.php");
    });
    $('#clientAdd').click(function () {
        addClient();
    });
    $('.aDialog').live("mouseover", function () {
        $(this).css('color', 'blue').css('text-decoration', 'underline');
    });
    $('.aDialog').live("mouseout", function () {
        $(this).css('color', '').css('text-decoration', '');
    });
    $('.cliResCmd').live("click", function () {
        var cmd = $(this).attr('cmd');
        var cid = $(this).attr('cid');
        var json = $(this).attr('json');
        switch (cmd) {
            case 'clientDel':
                confirmAction("Ð”ÐµÐ¹ÑÑ‚Ð²Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾ ÑƒÐ´Ð°Ð»Ð¸Ñ‚ÑŒ ÐºÐ°Ñ€Ñ‚Ñƒ Ð½Ð¾Ð¼ÐµÑ€ " + cid + "?", function () {
                    $('#clientSearchResults').dialog("close");
                    messageBox("Ð¡Ð¾Ð²ÐµÑ€ÑˆÐ°ÐµÐ¼ Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ðµ");
                   /* $.ajax({ type: 'POST', url: 'support.php', data: 'cmd=clientDel&cid=' + cid, timeout: 10000,
                        success: function (data) {
                            if (data.match(/^OK/)) {
                                messageBox('ÐšÐ°Ñ€Ñ‚Ð° ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð° ÑƒÐ´Ð°Ð»ÐµÐ½Ð°');
                            } else {
                                messageBox('ÐžÑˆÐ¸Ð±ÐºÐ°: ' + data);
                            }
                        },
                        error: function () {
                            messageBox('ÐžÑˆÐ¸Ð±ÐºÐ° ÑÐ²ÑÐ·Ð¸ Ñ ÑÐµÑ€Ð²ÐµÑ€Ð¾Ð¼ - Ð¿Ð¾Ð¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ ÐµÑ‰Ðµ Ñ€Ð°Ð·');
                        }
                    });*/
                });
                break;
            case 'clientAddNote':
                messageBox('Ð”Ð¾Ð±Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ð¿Ñ€Ð¸Ð¼ÐµÑ‡Ð°Ð½Ð¸Ñ Ð¿Ð¾ ÐºÐ»Ð¸ÐµÐ½Ñ‚Ñƒ: ' + cid);
                break;
            case 'clientDetails':
                messageBox('ÐžÑ‚Ñ‡ÐµÑ‚ Ð¿Ð¾ ÐºÐ»Ð¸ÐµÐ½Ñ‚Ñƒ: ' + cid);
                break;
            case 'clientEdit':
                editClient(cid, json);
                break;
            default:
        }
    });
    $('#searchBets').keyup(function (e) {
        clearTimeout(eventSearchOnKeyPressTimeout);
        if (e.keyCode == 13) {
            waitBox('ÐžÑ‚ÐºÑ€Ñ‹Ð²Ð°ÐµÐ¼ ÑÐ¾Ð±Ñ‹Ñ‚Ð¸Ñ');
        }
        if (e.keyCode == 27) {
            if ($(this).val() == '') {
                $(this).val('');
                $('#searchEvents').trigger("click");
            }
            $(this).val('');
        }
        var str = $(this).val();
        if (str.length > 0) {
            eventSearchOnKeyPressTimeout = setTimeout(function () {
              /*  $.ajax({ type: 'POST', url: 'support.php', timeout: 10000, data: 'cmd=searchBets&q=' + str,
                    success: function (data) {
                        //$('#searchBetsHint').html("&nbsp;"+data+"&nbsp;");
                        $('#searchBetsHint').html("&nbsp;");
                        try {
                            var events = eval('(' + data + ')');
                            var eventsTxt = '';
                            var eventsRow = '<tr class="eventRow" event_id=":id" event_name=":nameRU" eventBeginMSK=":eventBeginMSK"><td>(<font style="color: green">:idModulo</font>)</td><td>:league_nameRU</td><td>:nameRU</td><td>:eventBeginMSK</td></tr>';
                            var eventsHead = "<tr><th>#</th><th>Ð›Ð¸Ð³Ð°</th><th>Ð¡Ð¾Ð±Ñ‹Ñ‚Ð¸Ðµ</th><th>Ð”Ð°Ñ‚Ð°</th></tr>";
                            for (var eventI in events) {
                                if (events[eventI]['LiveEvent'] == 1) {
                                    events[eventI]['idModulo'] = events[eventI]['id'] % 1000 + '&nbsp;<font color="#ffff00">Live!</font>';
                                } else {
                                    events[eventI]['idModulo'] = events[eventI]['id'] % 10000;
                                }
                                eventsTxt += processTemplate(eventsRow, events[eventI]);
                            }
                            if (getInStatus() == 1) {
                                eventsTxt = '<center><table style="color:rgb(175,175,175);">' + eventsHead + eventsTxt + "</table></center>";
                            } else {
                                eventsTxt = '<center><table style="color:rgb(17,17,17);">' + eventsHead + eventsTxt + "</table></center>";
                            }
                            $('#generalBets').html(eventsTxt);
                        } catch (e) {
                            messageBox('Ð¡ÐµÑ€Ð²ÐµÑ€ ÑÐ¾Ð¾Ð±Ñ‰Ð¸Ð» Ð¾ÑˆÐ¸Ð±Ð¾Ñ‡Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ, Ð¾Ð±Ñ€Ð°Ñ‚Ð¸Ñ‚ÐµÑÑŒ Ðº Ñ€Ð°Ð·Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸ÐºÑƒ!');
                        }
                    },
                    error: function () {
                        $('#searchBetsHint').html('&nbsp;');
                    }
                });*/
                $('#searchBetsHint').html('... Ð¸Ð´ÐµÑ‚ Ð¿Ð¾Ð¸ÑÐº ...');
            }, 1000);
        } else {
            $('#searchBetsHint').html('&nbsp;');
        }
    });
    $('#searchEvents').click(function () {
        if ($('#betpanel:visible').length == 0) {
            $('#betpanel').fadeIn(2000, function () {
                $('#searchBets').val('').focus();
            });
        } else {
            $('#betpanel').fadeOut(2000);
        }
    });
    $('#pokerModule').click(function () {
        if ($('#pokerpanel:visible').length == 0) {
            $('#pokerpanel').show().html('<iframe src="bmpoker_cashier/" style="width:1024px; height:530px;"></iframe>');
        } else {
            $('#pokerpanel').hide().html('');
        }
    });
    $('#omahaModule').click(function () {
        if ($('#omahapanel:visible').length == 0) {
            $('#omahapanel').show().html('<iframe src="bmpoker_omaha_cashier/" style="width:1024px; height:530px;"></iframe>');
        } else {
            $('#omahapanel').hide().html('');
        }
    });
    $('#bingoModule').click(function () {
        if ($('#bingopanel:visible').length == 0) {
            $('#bingopanel').show().html('<iframe src="bingoCashier/" style="width:1170px; height:600px;"></iframe>');
        } else {
            $('#bingopanel').hide().html('');
        }
    });
    $('#kenoModule').click(function () {
        if ($('#kenopanel:visible').length == 0) {
            $('#kenopanel').show().html('<iframe src="keno_cashier/" style="width:1170px; height:600px;"></iframe>');
        } else {
            $('#kenopanel').hide().html('');
        }
    });
    $('#pinSaleModule').click(function () {
        if ($('#pinpanel:visible').length == 0) {
            $('#pinpanel').show().html('<iframe src="pinsale_cashier/" style="width:1024px; height:252px;"></iframe>');
        } else {
            $('#pinpanel').hide().html('');
        }
    });
    $('#racingModule').click(function () {
        if ($('#racingpanel:visible').length == 0) {
          //  $('#racingpanel').show().html('<iframe src="bmracing_cashier/index_main.php" style="width:1090px; height:685px;"></iframe>');
        } else {
            $('#racingpanel').hide().html('');
        }
    });
    $('.eventTimeTd').live("click", function (e) {
        showMessages($(this).attr('event_id'), $(this).attr('event_name'));
    });
    $('.eventTimeTd').live("mouseover", function () {
        $(this).addClass("underlined");
    });
    $('.eventTimeTd').live("mouseout", function () {
        $(this).removeClass("underlined");
    });

    $('.eventRow').live("click", function (e) {
        if (!$(e.target).hasClass("eventTimeTd"))
            showGames($(this).attr('event_id'), $(this).attr('event_name'), 0);
    });
    $('.eventRow').live("mouseover", function () {
        $(this).addClass("eventRow_hovered");
        $(this).find('.eventTimeTd').html('--- Ð¿Ð¾Ð´Ñ€Ð¾Ð±Ð½Ð¾ÑÑ‚Ð¸ ---');
    });
    $('.eventRow').live("mouseout", function () {
        $(this).removeClass("eventRow_hovered");
        $(this).find('.eventTimeTd').html($(this).attr('eventBeginMSK'));
    });
    $('.resultRow').live("mouseover", function () {
        $(this).addClass("highlightResult");
    });
    $('.resultRow').live("mouseout", function () {
        $(this).removeClass("highlightResult");
    });
    $('.resultRow').live("click", function () {
        addResult2Slip(this);
    });
    $('.ridRemove').live("click", function () {
        var slipRow = $(this).parent().parent();
        if (slipRow) {
            slipRow.remove();
        }
    });

    $('.reportedSlip').live("mouseover", function () {
        $(this).addClass('highlightSlip');
    });
    $('.reportedSlip').live("mouseout", function () {
        $(this).removeClass('highlightSlip');
    });
    $('.reportedSlip').live("click", function () {
        var slipid = $(this).attr('slipid');
        showDetailedSlip(slipid);
    });
    /*
    following block gets called when coupon's input value got changed...
    it updates possibleWin's value also...
    */
    $('.slipBetValueInput').live("keyup", function (event) {
        if ($(this).val().match(/[^0-9]/)) {
            $(this).css('background-Color', '#ff0000');
        } else {
            $(this).css('background-Color', '#ffffff');
            // no take 'betvalue'+rid multiply by current odd0 and put result 'possibleWin'+rid
            var rid = $(this).attr('rid');
            var bv = $('#betValue' + rid).val();
            var odd0 = $('#ridOdd' + rid).html();
            $('#possibleWin' + rid).html(roundNumber(bv * odd0, 2) + "<b>RUR</b>");
        }
    });
    $('#slipClientCardEdit').live("keyup", function () {
        slipGetClient($(this).val());
    });
    $('.slipBetValueInput').live("focus", function () {
        if ($(this).val() == 0) {
            $(this).val('');
        }
    });
    $('#expressAmountI').live("focus", function () {
        if ($(this).val() == 0) {
            $(this).val('');
        }
    });

    $('#checkStake').click(function () {
        checkStake();
    });
    $(document).keyup(function (e) {
        if (e.keyCode == 192) {
            e.stopPropagation();
            checkStake();
        }
    });
    $('#currentReport').click(function () {
        currentReport();
    });
    initialize_live();
});
