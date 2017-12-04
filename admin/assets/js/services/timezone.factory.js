angular.module('gsadmin').factory('timezoneFactory', function () {
    return {
        get: function () {
            var timezones = moment.tz.names();
            // var timezoneMap = {};
            var zoneName;
            var timezoneArr = [];

            for (var i = 0; i < timezones.length; i++){
                zoneName = timezones[i];
                var tz = moment.tz(zoneName);
                timezoneArr.push({
                    id: zoneName,
                    name: zoneName.replace(/_/g, ' '),
                    offset: 'UTC' + tz.format('Z'),
                    nOffset: tz.utcOffset(),
                    label: 'UTC' + tz.format('Z') + ' ' + zoneName.replace(/_/g, ' ')
                });
                // timezoneMap[zoneName] = {
                //     id: zoneName,
                //     name: zoneName.replace(/_/g, ' '),
                //     offset: 'UTC' + tz.format('Z'),
                //     nOffset: tz.utcOffset(),
                //     label: zoneName.replace(/_/g, ' ') + ' ' + 'UTC' + tz.format('Z')
                // };
            }

            return timezoneArr
        }
    }
});