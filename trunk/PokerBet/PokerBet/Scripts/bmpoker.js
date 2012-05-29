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
var  
    callGetStakes = 0;
var 
	currentRIDS;
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


function waitBox(info) {
    if ($('#waitBox').length == 0) {
        $('body').append('<div title="Регистрация" id="waitBox" style="display:none; z-index:9999;"></div>');
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
function messageBox(info) {
    if ($('#messageBox').length == 0) {
        $('body').append('<div title="Регистрация" id="messageBox" style="display:none"></div>');
        $('#messageBox').dialog({
            modal: true,
            autoOpen: false,
            position: 'center',
            buttons: {
                "Okay": function () {
                    $(this).dialog("close");
                }
            }
        });
    }
    $('#messageBox').html(info).dialog("open");
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
    callGetStakes++;
    if (callGetStakes % 2 == 0) {
        $.ajax({ type: 'GET', url: '/Home/Stakes', data: '', timeout: 30000,
            success: function (data) {
                try {
                    var json = eval('(' + data + ')');
                    $('.chip').each(function (idx, obj) {
                        var currentPlayer = $(obj).attr('player');
                        var chipMarked = 0;
                        for (var player in json) {
                            if (json[player] != 0) {
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
}
function changeMain(data) {
    $('#log').html(data);
    try {
        //var json = eval('('+data+')');
        json = data;
        //        pbValue = json['ts'] - json['timestamp']; pbValue = Math.round(pbValue / 0.60);
        pbValue = json['ts']; pbValue = Math.round(pbValue / 0.60);
        //pbValue = json['timestamp']; pbValue = Math.round(pbValue / 0.60);
        if (pbValue > 100) {
            pbValue = 100;
        }
        
        $('#progress_bar .ui-progress').animateProgress(pbValue, null);


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

                    deskCardsHTML += '<div style="display:none;margin-left:1px; margin-top: 3.6px;width:42px" class="deskCards cart"><div class="num">' + cardNum + '</div><div class="lear ' + learsClass[deskCards[i].charAt(1)] + '" >' + lears[deskCards[i].charAt(1)] + '</div></div>';
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
                if (gameStep == 3) {
                    $('.flop').addClass('card');
                }
                if (gameStep == 4) {
                    $('.flop').addClass('card');
                    $('.turn').addClass('card');
                }
                if (gameStep == 5) {
                    $('.flop').addClass('card');
                    $('.turn').addClass('card');
                    $('.river').addClass('card');
                }			
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
                    var phClass = "item game-item";
                    var phClassStake = "button black butSumm odd";
                    if (K == 0) {
                        if (gameStep == 5) {
                            K = "LOST";
                        } else {
                            K = "n/a";
                        }
                        phClass = "itemLost game-item";
                        phClassStake = "button rosy butSumm";
                    } else {
                        if (gameStep == 5 || K < 1) {
                            if (gameStep == 5) {
                                K = "WINS";
                                $(placeholder + 'G').fadeIn(1000);
                            } else {
                                K = "1.00";
                            }
                            phClass = "itemWin game-item";
                            phClassStake = "button green butSumm";
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
                    if ($(placeholder + 'K').hasClass("game-item")) {
                        $(placeholder + 'K').html(K).attr('class', phClass);
                    } else {
                        $(placeholder + 'K').val(K).attr('class', phClassStake);
                    }
                    
                    $(placeholder + 'N').html(playerName);
                }
            }
        }
        if (flop == 1) {
            $('#draw').html('Flop');
            $('.card').removeClass('card');
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
                data = $.parseJSON(data.responseText);
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
    $.ajax({ type: 'GET', url: '/Home/Main', data: { isStatic : 'false'}, timeout: 3000, async: false,
        complete: function (data) {
            globalData = $.parseJSON(data.responseText);
            //globalData = {'three':{'playersNo':'8','deskCards':'Qh Qd 5c 2d 3h','BH':'Straight','players':{'6':{'K':'0.97','cards':'4h 6d','id':'#three6','V':'1.0000'},'4':{'K':'0','cards':'3c 5s','id':'#three4','V':'0.0000'},'1':{'K':'0','cards':'As Qs','id':'#three1','V':'0.0000'},'3':{'K':'0','cards':'Jc 9s','id':'#three3','V':'0.0000'},'0':{'K':'0','cards':'Kh 2c','id':'#three0','V':'0.0000'},'7':{'K':'0','cards':'Ts Kd','id':'#three7','V':'0.0000'},'2':{'K':'0','cards':'4c Ad','id':'#three2','V':'0.0000'},'5':{'K':'0','cards':'4d 2h','id':'#three5','V':'0.0000'}}},'timestamp':1336736106,'one':{'playersNo':'4','deskCards':'Ac Qs 4s 2d 8d','BH':'OnePair','players':{'1':{'K':'0.97','cards':'5d Qd','id':'#one1','V':'1.0000'},'3':{'K':'0','cards':'7h 8s','id':'#one3','V':'0.0000'},'0':{'K':'0','cards':'Kh 6d','id':'#one0','V':'0.0000'},'2':{'K':'0','cards':'Ts Js','id':'#one2','V':'0.0000'}}},'two':{'playersNo':'6','deskCards':'Ks 2h 5c 3d 2s','BH':'Trips','players':{'4':{'K':'0.97','cards':'2d 9h','id':'#two4','V':'1.0000'},'1':{'K':'0','cards':'7d 5s','id':'#two1','V':'0.0000'},'3':{'K':'0','cards':'8c 3h','id':'#two3','V':'0.0000'},'0':{'K':'0','cards':'Jd Qs','id':'#two0','V':'0.0000'},'2':{'K':'0','cards':'Ts 9d','id':'#two2','V':'0.0000'},'5':{'K':'0','cards':'3s 5h','id':'#two5','V':'0.0000'}}},'ts':'1336736118'};
            changeMain(globalData);
        }
    });
}

function pulse() {

    $.ajax({ type: 'GET', url: '/Stake/CurrentRids', data: '', timeout: 10000,
        success: function (data) {
            var json = eval('(' + data + ')');
            currentRIDS = json;
            drawShoppingCart();
        }
    });

  //  $('#round').html(roundNo);
   // getStakes();
  //  getMain();
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
var clearPositionRedraw = true;
function clearPosition(idx) {
    if (shoppingCart[idx] !== null) {
        var j = 0;
        var newShoppingCart = new Array();
        for (i = 0; i < shoppingCart.length; i++) {
            if (i != idx) {
                newShoppingCart[j] = shoppingCart[i];
                j++;
            }
        }
        shoppingCart = newShoppingCart;
        if (clearPositionRedraw == true) {
            drawShoppingCart();
        }
    }
}
function drawShoppingCart() {
    var currentAmount = parseInt($('#totalSumm').val());
    var currentPerAmount;
    var expressOdd = 1;
    var runningExpress = $('#buttonExpress').hasClass('orange');
    if (shoppingCart.length != 0) {
        currentPerAmount = currentAmount / shoppingCart.length;
    } else {
        currentPerAmount = 0;
    }
    currentPerAmount = number_format(currentPerAmount, 2, ".", " ");
    positions2clear = new Array();
    for (var idx in shoppingCart) {
        var nameIDX = parseInt(idx) + 1;
        $('#name' + nameIDX).val(shoppingCart[idx].replace(/[^0-9]/g, ''));
        for (var rid in currentRIDS) {
            if (currentRIDS[rid]['ridName'] == shoppingCart[idx]) {
                $('#coef' + nameIDX).val(currentRIDS[rid]['odd0']);
                if (runningExpress) {
                    $('#summ' + nameIDX).val('');
                    expressOdd *= parseFloat(currentRIDS[rid]['odd0']);
                } else {
                    $('#summ' + nameIDX).val(currentPerAmount);
                }
                if (currentRIDS[rid]['odd0'] <= 1) {
                    positions2clear.push(idx);
                }
                break;
            }
        }
    }
    if (runningExpress) {
        $('#express').val(number_format(expressOdd, 2, ".", ""));
    } else {
        $('#express').val('');
    }
    for (var idx = shoppingCart.length + 1; idx <= 5; idx++) {
        $('#name' + idx).val('');
        $('#coef' + idx).val('');
        $('#summ' + idx).val('');
    }
    clearPositionRedraw = false;
    for (var i = 0; i < positions2clear.length; i++) {
        clearPosition(positions2clear[i]);
    }
    clearPositionRedraw = true;
    if (shoppingCart.length == 0) {
        if ($('#buttonExpress').hasClass('orange')) {
            $('#buttonExpress').removeClass('orange').addClass('black');
        }
    }
}
function highlightExpress() {
    if (isExpressPossible()) {
        if ($('#buttonExpress').hasClass('gray')) {
            $('#buttonExpress').removeClass('gray');
        }
    } else {
        if (!$('#buttonExpress').hasClass('gray')) {
            $('#buttonExpress').addClass('gray');
        }
    }
}
function isExpressPossible() {
    if (shoppingCart.length > 1) {
        var tbl = new Array();
        tbl[1] = 0; tbl[2] = 0; tbl[3] = 0;
        for (var idx in shoppingCart) {
            var curName = parseInt(shoppingCart[idx].replace(/[^0-9]/g, ''));
            if (curName >= 10 && curName < 20) { tbl[1]++; }
            if (curName >= 20 && curName < 30) { tbl[2]++; }
            if (curName >= 30 && curName < 40) { tbl[3]++; }
        }
        for (var idx in tbl) {
            if (tbl[idx] > 1) {
                return false;
            }
        }
        return true;
    }
    return false;
}

var shoppingCart = new Array();
/*google.load("jquery", "1.4.4");
google.load("jqueryui", "1.7.2");*/
$(function () {
    $('#log').hide();
    //$('body').after('<div id="tmp"></div>');
    var mainLoop = setInterval(function () {
        //$('#round').html(roundNo);
        if (globalData != undefined && (globalData.ts) < 50) {
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
        if (deskCards == 0) getHistory();

        $('#tmp').html(deskCards + '   ' + (globalData.ts));
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

    $('.calc').live("click", function () {
        var value = $(this).val();
        if (/^[0-9]+$/.test(value)) {
            // this is numeric button
            var currentValue = parseInt($('#totalSumm').val());
            currentValue += parseInt(value);
            $('#totalSumm').val(currentValue);
            drawShoppingCart();
        } else if (value == "Clear") {
            $('#totalSumm').val("0");
        } else if (value == "Combi") {
            if ($(this).hasClass('orange')) {
                $(this).removeClass('orange').addClass('black');
            } else if ($(this).hasClass('black')) {
                if (isExpressPossible()) {
                    $(this).removeClass('black').addClass('orange');
                } else {
                    messageBox('Экспресс возможен при условия выбора двух или более независимых событий');
                }
            }
        } else if (value == "Print...") {
            var value = parseInt($('#totalSumm').val());
            var playerList = '';
            var oddList = '';
            if (/^[0-9]+$/.test(value) && parseInt(value) > 0 && shoppingCart.length > 0) {
                $('#totalSumm').val("0");
                waitBox('Подождите, идет регистрация ставки...');
                // collecting 
                //	sliptext = rid:value,rid:value,...
                //	oddlist = odd0,odd0,odd0,...
                //
                if ($('#buttonExpress').hasClass('orange')) {
                    //alert("generating mkSlipE.php");
                } else {
                    playerList = '';
                    oddList = '';
                    for (var idx in shoppingCart) {
                        var scKey = shoppingCart[idx];
                        var stakeValue = number_format(value / shoppingCart.length, 2, ".", "");
                        for (var rid in currentRIDS) {
                            if (currentRIDS[rid]['ridName'] == scKey) {
                                playerList += currentRIDS[rid]['ridName'].replace(/[^0-9]/g, '') + ",";
                                oddList += currentRIDS[rid]['odd0'] + ",";
                                break;
                            }
                        }
                    }

                    $.ajax({ type: 'GET', url: '/Stake/Create', data: { playerList: playerList, oddList: oddList, sum: value }, timeout: 10000,
                        success: function (data) {
                            var json = eval('(' + data + ')');
                            currentRIDS = json;
                            drawShoppingCart();
                            if (data != -1) {
                                window.open("/Check/Index/" + data.toString(), '_blank');
                                unwaitBox();
                            }
                        }
                    });

                    //alert("registering mkSlip.php?slip="+sliptext+"&ol="+oddlist);
                }
                shoppingCart = new Array();
                highlightExpress();
                drawShoppingCart();
            } else {
                messageBox('Введите сумму ставки или выберите хотя бы один исход.');
            }
        }
    });

    $('.butDel').live("click", function () {
        var idx = parseInt($(this).attr('id').replace(/[^0-9]/g, '')) - 1;
        clearPosition(idx);
        highlightExpress();
    });

    $('.odd').live("click", function () {
        var myID = $(this).attr('id').replace(/K$/g, "").replace(/^one/g, "1").replace(/^two/g, "2").replace(/^three/, "3");
        for (var rid in currentRIDS) {
            if (currentRIDS[rid]['ridName'].replace(/[^0-9]/g, '') == myID) {
                if (shoppingCart.indexOf(currentRIDS[rid]['ridName']) == -1) {
                    if (shoppingCart.length == 5) {
                        messageBox('Уже выбрано максимальное число исходов!');
                    } else {
                        shoppingCart.push(currentRIDS[rid]['ridName']);
                        if ($('#buttonExpress').hasClass('orange')) {
                            $('#buttonExpress').removeClass('orange').addClass('black');
                        }
                        drawShoppingCart();
                        highlightExpress();
                    }
                } else {
                    messageBox('Игрок уже выбран!');
                }
            }
        }
    });
    //pulse();

    loadProgressBar();
    $(function () {
        setInterval(function () { pulse(); }, 1000);
        $('#totalSumm').val('0');
        getHistory();
        $('#progressbar .ui-progress .ui-label').hide();
        $('#progressbar .ui-progress').css('width', '0%');
        $()
    });
});






