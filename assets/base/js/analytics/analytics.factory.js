(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .factory('Analytics', AnalyticsStats);

    AnalyticsStats.$inject = ['envService', 'userProfileService'];

    /* @ngInject */
    /**
     * @param envService
     * @param {userProfileService} userProfileService
     * @returns {Analytics}
     * @constructor
     */
    function AnalyticsStats(envService, userProfileService) {

        /** Include Segment **/

        !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="3.1.0";
            analytics.load(envService.read('apiKeySegment'));
            //analytics.page();
        }}();

        return {

            trackEvent: function(category, action, label, params){

                var mixpanelName = category;

                if(action){ mixpanelName += ':' + action; }
                if(label){  mixpanelName += ':' + label; }

                /** Segment **/

                    this.identify();
                    console.log('Analytics: ', mixpanelName, params); // @TODO не трогать без Антона
                    analytics.track(mixpanelName, params);
                    //carrotquest.track(mixpanelName, params);

            },

            identify: function(id, name, lname){

                // Mixpanel

                ga(function(tracker) {
                    console.log('Analytics: identifying '+ tracker.get('clientId'));
                    document.cookie = "_ga_cid=" + tracker.get('clientId') + "; path=/"; // save it to cookie _ga_cid

                    userProfileService
                        .loadUserProfile()
                        .then(function (userProfile) {

                            var createdDate = new Date(userProfile.userData.createTime);

                            var yearStart = new Date(createdDate.getFullYear(),0,1);
                            var weekNo = Math.ceil((((createdDate - yearStart) / 86400000) + 1) / 7);

                            var gg_cohortMonth = createdDate.getMonth() + 1; // Дегенераты которые делали JS решили что первый месяц будет с индексом 0. Поэтому инкрементируем.
                            var gg_cohortWeek = createdDate.getFullYear().toString() + weekNo;

                            var peopleData = {

                                // Identity

                                "$email":          userProfile.userData.email,
                                "email":           userProfile.userData.email,
                                "$created":        createdDate,
                                "created":         createdDate,
                                "$last_login":     new Date(),
                                "last_login":      new Date(),
                                "$first_name":     userProfile.userData.name,
                                "first_name":      userProfile.userData.name,

                                // Billing

                                "gg_starpoints":    userProfileService.getUserStarpoints(),
                                "gg_realpoints":    userProfileService.getUserRealpoints(),

                                // Status

                                "gg_status":        userProfile.userData.active,
                                "gg_experience":    userProfile.userData.experience,
                                "gg_level":         userProfile.level,
                                "gg_id":            userProfile.userData.id,
                                "gg_lang":          userProfile.userData.lang,

                                // Cohorts

                                "gg_cohort_month":  gg_cohortMonth,
                                "gg_cohort_week":   gg_cohortWeek,
                                "gg_cohort_date":   createdDate,

                                // Games

                                "gg_lol_accounts":  userProfile.gameAccounts.length

                            };

                            console.log(peopleData);

                            /** Segment **/

                            analytics.identify(tracker.get('clientId'), peopleData, peopleData);

                            ///** Carrot Quest **/
                            //
                            //var carrotQuestData = [];
                            //
                            //for (var key in peopleData){
                            //    if (!peopleData.hasOwnProperty(key)){
                            //        continue;
                            //    }
                            //
                            //    carrotQuestData.push({
                            //        'op': 'update_or_create',
                            //        'key': key,
                            //        'value': peopleData[key]
                            //    });
                            //}
                            //
                            //carrotquest.identify(carrotQuestData);

                        })
                        .catch(function () {
                            analytics.identify(tracker.get('clientId'));
                        });

                });

            }
        };
    }

})();