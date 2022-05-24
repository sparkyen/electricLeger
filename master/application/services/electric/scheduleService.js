'use strict';
var cache = require('memory-cache');
const accountService = require('./accountService');
const queryService = require('./queryService');
const tradeService = require('./tradeService');
const acutonService = require('./acutionService')
const dataService = require('../electric/dataService');




const accountSvcInstance = new accountService();
const querySvcInstance = new queryService();
const tradeSvcInstance = new tradeService();
const acutonSvcInstance = new acutonService();
const dataSvcInstance = new dataService();


const schedule = require('node-schedule');


class ScheduleService {
    async task() {
        await dataSvcInstance.generate(7, 9);
        let response = await acutonSvcInstance.excute()
        await dataSvcInstance.generate(3, 1);
        console.log(response);
    }

    async run(){
        // 实例化定时任务
        let rule = new schedule.RecurrenceRule();
        let times = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58];  // 每隔5秒
        // let times = [1, 11, 21, 31, 41, 51];
        rule.minute = times;  // 只设置秒，将times数组赋值给rule.second(秒)
        schedule.scheduleJob(rule, () => {
            console.log(new Date);
            this.task();
        });
    }

    async test(){
        // 实例化定时任务
        let rule = new schedule.RecurrenceRule();
        let times = [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56];  // 每隔5秒
        // let times = [1, 11, 21, 31, 41, 51];
        rule.second = times;  // 只设置秒，将times数组赋值给rule.second(秒)
        schedule.scheduleJob(rule, () => {
            console.log(new Date);
            console.log('TEST RUNNING');
        });
    }

    
    
    
}

module.exports = ScheduleService;
