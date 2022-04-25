function randomNum(m, n) {
    return Math.floor(Math.random() * (n - m)) + m;
}

function randomFloat(m, n) {
    return parseFloat((Math.random() * (n - m) + m).toFixed(2));
}

function dataGenerater(role, num, minPrice, maxPrice, minAmount, maxAmount) {
    let id = 0,
        data = [];
    while (id < num) {
        let dataDetail = {};
        dataDetail.id = id, id += 1;
        dataDetail.expectPrice = randomFloat(minPrice, maxPrice);
        if (role == 'seller') dataDetail.bottomPrice = randomFloat(minPrice, dataDetail.expectPrice);
        else dataDetail.bottomPrice = randomFloat(dataDetail.expectPrice, maxPrice);
        dataDetail.amount = randomNum(minAmount, maxAmount);
        data.push(dataDetail);
    }
    return data;

}

function trade(sellBids, buyBids) {
    let tradeRecord = [], nowSellRestNum, nowBuyRestNum;
    var bestPrice = 0, roundNum = 1;
    while (sellBids.length != 0 && buyBids.length != 0) {
        let m = sellBids.length, n = buyBids.length;
        let sid = 0, bid = 0;
        let sellRest = [], buyRest = [];
        
        // trade going
        while (sid < m && bid < n) {
            // console.log("sellerId: "+sid+", buyerId: "+bid);
            let nowSeller = sellBids[sid], nowBuyer = buyBids[bid];
            if (nowSeller.expectPrice <= nowBuyer.expectPrice) {
                let tradeDetail = {};
                tradeDetail.round = roundNum;
                tradeDetail.seller = nowSeller.id;
                tradeDetail.buyer = nowBuyer.id;
                bestPrice = tradeDetail.price = parseFloat(((nowSeller.expectPrice + nowBuyer.expectPrice) / 2).toFixed(2));
                if (nowSeller.amount >= nowBuyer.amount) {
                    tradeDetail.amount = nowBuyer.amount, bid += 1;
                    nowSeller.amount -= nowBuyer.amount, nowBuyer.amount = 0;
                } else {
                    tradeDetail.amount = nowSeller.amount, sid += 1;
                    nowBuyer.amount -= nowSeller.amount, nowSeller.amount = 0;
                }
                tradeRecord.push(tradeDetail);
            } else {
                sellRest.push(nowSeller), sid += 1;
                buyRest.push(nowBuyer), bid += 1;
            }
        }
        console.log('*********************** Round ' + roundNum + ' ***********************');

        if(sellRest.length==sellBids.length && buyRest.length==buyBids.length){
            console.log("All trade has been done, market closed !")
            break;
        }
        console.log('tradeRecord: '), console.log(tradeRecord);
        console.log('sellRest: '), console.log(sellRest);
        console.log('buyRest: '), console.log(buyRest);

        console.log('==================== Best Price: '+bestPrice+' ==================== ');
        //ajust
        let srid = 0, brid = 0, k = 0.9;
        for (let i = 0; i < sellRest.length; i++) {
            if (sellRest[i].expectPrice <= bestPrice) continue;
            let nowExpectPrice = sellRest[i].expectPrice - k * (sellRest[i].expectPrice - bestPrice);
            sellRest[i].expectPrice = Math.max(sellRest[i].bottomPrice, parseFloat(nowExpectPrice.toFixed(2)));
        }
        for (let i = 0; i < buyRest.length; i++) {
            if (buyRest[i].expectPrice >= bestPrice) continue;
            let nowExpectPrice = buyRest[i].expectPrice - k * (buyRest[i].expectPrice - bestPrice);
            buyRest[i].expectPrice = Math.min(buyRest[i].bottomPrice, parseFloat(nowExpectPrice.toFixed(2)));
        }
        sellBids = sellRest.sort(function (a, b) {
            return a.expectPrice - b.expectPrice;
        });
        buyBids = buyRest.sort(function (a, b) {
            return b.expectPrice - a.expectPrice;
        });
        roundNum += 1;
        
        console.log('After ajust sellBids: '), console.log(sellBids);
        console.log('After ajust buyBids: '), console.log(buyBids);

        // break;
    }
    


}

function generate() {
    var data = [];
    var sellerData = dataGenerater('seller', 13, 4.5, 9.8, 120, 240).sort(function (a, b) {
        return a.expectPrice - b.expectPrice;
    });
    var buyerData = dataGenerater('buyer', 9, 2.3, 7.8, 50, 130).sort(function (a, b) {
        return b.expectPrice - a.expectPrice;
    });
    data.push(sellerData), data.push(buyerData);
    console.log('Seller: '), console.log(sellerData);
    console.log('Buer: '), console.log(buyerData);
    return data;
}
var data = generate();
// console.log(data);
trade(data[0], data[1]);

// console.log(randomNum(7, 34));
// console.log(randomFloat(2.3, 9.8));
