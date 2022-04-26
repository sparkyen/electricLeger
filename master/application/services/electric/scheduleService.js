'use strict';
var cache = require('memory-cache');
const accountService = require('./accountService');
const queryService = require('./queryService');
const tradeService = require('./tradeService');
const acutonService = require('./acutionService')

const accountSvcInstance = new accountService();
const querySvcInstance = new queryService();
const tradeSvcInstance = new tradeService();
const acutonSvcInstance = new acutonService();

const schedule = require('node-schedule');

class ScheduleService {
    async task() {
        let response = await acutonSvcInstance.excute()
        console.log(response);
    }

    async run(){
        // 实例化定时任务
        let rule = new schedule.RecurrenceRule();
        // let times = [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56];  // 每隔5秒
        let times = [1, 11, 21, 31, 41, 51];
        rule.minute = times;  // 只设置秒，将times数组赋值给rule.second(秒)
        schedule.scheduleJob(rule, () => {
            console.log(new Date);
            task();
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
