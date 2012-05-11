var 
	cache = new Array();
var 
	roundNo = 1;
var 
	CurRoundNo = 1;
var 
	pbValue = 0;
var 
	deskCards;
var 
	globalData;
var lears = {
    's': '&spades;',
    'c': '&clubs;',
    'd': '&diams;',
    'h': '&hearts;'
}
var learsClass = {
    's': '',
    'c': '',
    'd': 'red',
    'h': 'red'
}
function loadProgressBar() {
    (function ($) {
        $.fn.animateProgress = function (progress, callback) {
            return this.each(function () {
                $(this).animate({
                    width: progress + '%'
                }, {
                    duration: 5,
                    easing: 'swing',
                    step: function (progress) {
                        var labelEl = $('.ui-label', this),
	              valueEl = $('.value', labelEl);
                        if (Math.ceil(progress) < 20 && $('.ui-label', this).is(":visible")) {
                            labelEl.hide();
                        } else {
                            if (labelEl.is(":hidden")) {
                                labelEl.fadeIn();
                            };
                        }
                        if (Math.ceil(progress) == 100) {
                            labelEl.text('');
                            setTimeout(function () {
                                labelEl.fadeOut();
                            }, 1000);
                        } else {
                            valueEl.text('');
                        }
                    },
                    complete: function (scope, i, elem) {
                        if (callback) {
                            callback.call(this, i, elem);
                        };
                    }
                });
            });
        };
    })(jQuery);
}
function number_format(number, decimals, dec_point, thousands_sep) {
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}
function unique(a) {
    var r = new Array();
    o: for (var i = 0, n = a.length; i < n; i++) {
        for (var x = i + 1; x < n; x++) {
            if (a[x] == a[i]) continue o;
        }
        r[r.length] = a[i];
    }
    return r;
}
var 
	prevGameStep = 0;
var 
	pgsTable;
var 
	winList = new Array();
var 
	chipClasses = new Array("chipBlue", "chipBlack", "chipYellow", "chipRed");
function getStakes() {
    $.ajax({ type: 'GET', url: '/Home/Stakes', data: '', timeout: 10000,
        success: function (data) {
            try {
                var json = eval('(' + data + ')');
                $('.chip').each(function (idx, obj) {
                    var currentPlayer = $(obj).attr('player');
                    var chipMarked = 0;
                    for (var player in json) {
                        if (player == currentPlayer) {
                            $(obj).show();
                            $(obj).html(json[player]);
                            chipMarked = 1;
                            var classified = 0;
                            for (var i = 0; i < chipClasses.length; i++) {
                                if ($(obj).hasClass(chipClasses[i])) {
                                    classified = 1;
                                }
                            }
                            if (classified == 0) {
                                $(obj).addClass(chipClasses[Math.round(Math.random() * chipClasses.length)]);
                            }
                        }
                    }
                    if (chipMarked == 0) {
                        $(obj).hide();
                        for (var i = 0; i < chipClasses.length; i++) {
                            $(obj).removeClass(chipClasses[i]);
                        }
                    }
                });
            } catch (e) {
                //alert(e);
            }
        }
    });
}
function changeMain(data) {
    $('#log').html(data);
    try {
        //var json = eval('('+data+')');
        json = data;
        pbValue = json['ts'] - json['timestamp']; pbValue = Math.round(pbValue / 0.60);
        if (pbValue > 100) {
            pbValue = 100;
        }
        
        $('#progressbar .ui-progress').animateProgress(pbValue, null);


        var flop = 1;
        for (var table in json) {
            gameStep = 0;
            if (json[table]["BH"]) {
                $('#' + table + 'DeskC_1').show().html(json[table]["BH"]);
                $('#' + table + 'DeskC_2').show().html(json[table]["BH"]);
            } else {
                $('#' + table + 'DeskC_1').hide();
                $('#' + table + 'DeskC_2').hide();
            }
            if (json[table]["deskCards"]) {
                var deskCards = json[table]["deskCards"].split(" ");
                var deskCardsHTML = '';
                for (var i = 0; i < deskCards.length; i++) {
                    if (deskCards[i].charAt(0) == 'T') cardNum = 10;
                    else cardNum = deskCards[i].charAt(0);

                    deskCardsHTML += '<div   style="display:none;margin-left:1px; margin-top: 3.6px;width:42px" class="deskCards cart"><div class="num">' + cardNum + '</div><div class="lear ' + learsClass[deskCards[i].charAt(1)] + '" >' + lears[deskCards[i].charAt(1)] + '</div></div>';
                    gameStep++;
                }
                var key = '#' + table + 'Desk';
                if (cache[key] != deskCardsHTML) {
                    $(key).html(deskCardsHTML);
                    $('.deskCards').fadeIn(1000);
                    cache[key] = deskCardsHTML;
                }
                if (gameStep == 0) { $('#draw').html('Flop'); } else
                    if (gameStep == 3) { $('#draw').html('Turn'); } else
                        if (gameStep == 4) { $('#draw').html('River'); } else {
                            $('#draw').html('Draw');
                            if (prevGameStep == 4) {
                                roundNo++;
                            }
                        }
                prevGameStep = gameStep;
                pgsTable = table;
                flop = 0;
            } else {
                $('#' + table + 'Desk').html('');
            }

            if (json[table]["players"]) {
                for (var player in json[table]["players"]) {
                    var cards = json[table]["players"][player]["cards"].split(" ");
                    var placeholder = json[table]["players"][player]["id"];
                    var playerName = placeholder;
                    var K = json[table]["players"][player]["K"];
                    var cardsHTML = '';
                    for (var i = 0; i < cards.length; i++) {
                        var add2name = "";
                        if (K == 0) {
                            addStyle = "background-color:#AAAAAA";
                        } else {
                            addStyle = "background-color:#FFFFFF";
                        }
                        if (cards[i].charAt(0) == 'T') cardNum = 10;
                        else cardNum = cards[i].charAt(0);
                        if (i == 0) { cardsHTML += '<div style="display:none;' + addStyle + '" class=" playerCardsLeft cart"><div class="num">' + cardNum + '</div><div class="lear ' + learsClass[cards[i].charAt(1)] + '" >' + lears[cards[i].charAt(1)] + '</div></div>'; }
                        if (i == 1) { cardsHTML += '<div style="display:none;' + addStyle + '" class=" playerCardsRight cart"><div class="num">' + cardNum + '</div><div class="lear ' + learsClass[cards[i].charAt(1)] + '" >' + lears[cards[i].charAt(1)] + '</div></div>'; }
                    }
                    if (cache[placeholder] != cardsHTML) {
                        $(placeholder).html(cardsHTML);
                        $('.playerCardsLeft').fadeIn(1000);
                        $('.playerCardsRight').fadeIn(1000);
                        cache[placeholder] = cardsHTML;
                    }
                    playerName = playerName.replace('#', ''); playerName = playerName.replace('one', '1');
                    playerName = playerName.replace('two', '2'); playerName = playerName.replace('three', '3');
                    var phClass = "item";
                    if (K == 0) {
                        if (gameStep == 5) {
                            K = "LOST";
                        } else {
                            K = "n/a";
                        }
                        phClass = "itemLost";
                    } else {
                        if (gameStep == 5 || K < 1) {
                            if (gameStep == 5) {
                                K = "WINS";
                                $(placeholder + 'G').fadeIn(1000);
                            } else {
                                K = "1.00";
                            }
                            phClass = "itemWin";
                            if (gameStep == 5) {
                                if (winList[roundNo - 1] == null) {
                                    winList[roundNo - 1] = new Array();
                                }
                                winList[roundNo - 1].push(playerName);
                                winList[roundNo - 1] = unique(winList[roundNo - 1]);
                            }
                        } else {
                            K = "" + number_format(K, 2, '.');
                        }
                    }
                    $(placeholder + 'K').html(K).attr('class', phClass);
                    $(placeholder + 'N').html(playerName);
                }
            }
        }
        if (flop == 1) {
            $('#draw').html('Flop');
            $('.glow').hide();
        }
    } catch (e) {
        $('#log').html('JSON error: ' + e);
    }


}
function getHistory() {
    $.ajax({ type: 'GET', url: '/Home/Phistory', dataType: 'json', timeout: 10000,
        complete: function (data) {
            try {
                data = [["168372", "&nbsp;13,23,34"], ["168373", "&nbsp;13,22,25,36"], ["168374", "&nbsp;10,22,37"], ["168375", "&nbsp;12,21,22,34"], ["168376", "&nbsp;11,12,24,33"], ["168377", "&nbsp;10,21,34"], ["168378", "&nbsp;12,22,31"], ["168379", "&nbsp;10,22,35"]];
                //alert(data);
                //$('#logData').empty();
                //var data = eval('(' + string + ')');
                var string = '';
                data.reverse();

                for (idx in data) {
                    round = data[idx];
                    for (item in round) {
                        string += round[item] + ' ';
                    }
                    string += '<br>';
                }
                $('#historyTable > tbody > tr').each(function () {
                    var curData = data.pop();
                    //alert(curData[0]);
                    $(this).children('td:.tdRound').html(curData[0]);
                    $(this).children('td:.tdWinner').html(curData[1]);
                });
                //alert('Winners are set');
                //$('#logData').html(string);
            } catch (e) {
                //alert(e);
            }
        }
    });
}

function getMain() {
    $.ajax({ type: 'GET', url: '/Home/Main', data: '', timeout: 3000, async: false,
        complete: function (data) {

            globalData = $.parseJSON(data.responseText);
            //globalData = {'three':{'playersNo':'8','deskCards':'Qh Qd 5c 2d 3h','BH':'Straight','players':{'6':{'K':'0.97','cards':'4h 6d','id':'#three6','V':'1.0000'},'4':{'K':'0','cards':'3c 5s','id':'#three4','V':'0.0000'},'1':{'K':'0','cards':'As Qs','id':'#three1','V':'0.0000'},'3':{'K':'0','cards':'Jc 9s','id':'#three3','V':'0.0000'},'0':{'K':'0','cards':'Kh 2c','id':'#three0','V':'0.0000'},'7':{'K':'0','cards':'Ts Kd','id':'#three7','V':'0.0000'},'2':{'K':'0','cards':'4c Ad','id':'#three2','V':'0.0000'},'5':{'K':'0','cards':'4d 2h','id':'#three5','V':'0.0000'}}},'timestamp':1336736106,'one':{'playersNo':'4','deskCards':'Ac Qs 4s 2d 8d','BH':'OnePair','players':{'1':{'K':'0.97','cards':'5d Qd','id':'#one1','V':'1.0000'},'3':{'K':'0','cards':'7h 8s','id':'#one3','V':'0.0000'},'0':{'K':'0','cards':'Kh 6d','id':'#one0','V':'0.0000'},'2':{'K':'0','cards':'Ts Js','id':'#one2','V':'0.0000'}}},'two':{'playersNo':'6','deskCards':'Ks 2h 5c 3d 2s','BH':'Trips','players':{'4':{'K':'0.97','cards':'2d 9h','id':'#two4','V':'1.0000'},'1':{'K':'0','cards':'7d 5s','id':'#two1','V':'0.0000'},'3':{'K':'0','cards':'8c 3h','id':'#two3','V':'0.0000'},'0':{'K':'0','cards':'Jd Qs','id':'#two0','V':'0.0000'},'2':{'K':'0','cards':'Ts 9d','id':'#two2','V':'0.0000'},'5':{'K':'0','cards':'3s 5h','id':'#two5','V':'0.0000'}}},'ts':'1336736118'};
            changeMain(globalData);
            //setTimeout(function() {pulse();}, 1000);
        }
    });
}

function pulse() {
    $('#round').html(roundNo);
    getStakes();
    getMain();
    /*   for(i=roundNo-1;i>0 && i>=roundNo-8;i--) {
    $('td.tdRound').each(function(idx, obj){
    if ($(obj).attr('round')==roundNo-i) {
    $(obj).html(i);
    }
    });
    $('td.tdWinner').each(function(idx, obj){
    if ($(obj).attr('round')==roundNo-i) {
    $(obj).html(winList[i].sort().join(", "));
    }
    });
    }
    */
}

function getRound() {
    $.ajax({ type: 'GET', url: '/Home/Round', data: '', timeout: 10000,
        success: function (data) {
            if (deskCards == '5') {
                data++;
            }
            CurRoundNo = data;
            $('#round').html(data);
            //setTimeout(function() {pulse();}, 1000);
        },
        error: function () {
            //setTimeout(function() {pulse();}, 1000);
            //getRound();
        }
    });
}

google.load("jquery", "1.4.4");
google.setOnLoadCallback(function () {
    $('#log').hide();
    //$('body').after('<div id="tmp"></div>');
    var mainLoop = setInterval(function () {
        //$('#round').html(roundNo);
        if (globalData != undefined && (globalData.ts - globalData.timestamp) < 50) {
            globalData.ts++;
            changeMain(globalData);
        } else {
            getMain();
            getRound();
        }
        if (globalData.three.deskCards != undefined) {
            deskCards = globalData.three.deskCards.split(" ").length;
        } else {
            deskCards = 0;
        }
        if (deskCards != '5') {
            getStakes();
            var No = ~ ~CurRoundNo;
        } else {
            var No = ~ ~CurRoundNo;
        }
        if (deskCards == '0') getHistory();

        $('#tmp').html(deskCards + '   ' + (globalData.ts - globalData.timestamp));
        var j = 0;
        /*		for(i=roundNo-1;i>0 && i>=roundNo-8;i--) {
        $('td.tdRound').each(function(idx, obj){
        if ($(obj).attr('round')==roundNo-i) {
        $(obj).html(~~No-(roundNo-i));
        }
        });
        $('td.tdWinner').each(function(idx, obj){
        if ($(obj).attr('round')==roundNo-i) {
        $(obj).html(winList[i].sort().join(", "));
        }
        });
        }
        */
    }, 1000);

    //pulse();

    loadProgressBar();
    $(function () {
        getHistory();
        $('#progressbar .ui-progress .ui-label').hide();
        $('#progressbar .ui-progress').css('width', '0%');
    });
});

