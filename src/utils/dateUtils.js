
export function getPublishDateDescription(time) {
    if (!time) {
        return '';
    }
    return new Date(time).toRelativeTime(5000);
}

export function getReadingTimeDescription(minutes) {
    if (typeof(minutes) === "number") {
        return Math.ceil(Math.max(minutes,1)) + ' min read';
    }
    return '';
}

export function formatReadingTimeInMinutes(totalTimeInSeconds) {
    let minutes = Math.round(totalTimeInSeconds/60);
    let hours = Math.round(minutes/60);
    minutes = Math.round(minutes % 60);
    return FormatNumberLength(hours,2) + ":" + FormatNumberLength(minutes,2);
}

export function formatReadingTime(totalTimeInSeconds) {
    let minutes = Math.round(totalTimeInSeconds/60);
    let hours = Math.round(minutes/60);
    minutes = Math.round(minutes % 60);
    return FormatNumberLength(hours,2) + ":" + FormatNumberLength(minutes,2);
}

export function FormatNumberLength(num, length) {
    let r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}

export function getIDOfCurrentDate() {
    let currentDate = new Date();
    return FormatNumberLength(currentDate.getFullYear(),4) + FormatNumberLength(currentDate.getMonth() + 1,2) + FormatNumberLength(currentDate.getDate(),2);
}

Date.prototype.toRelativeTime = (function() {

    let _ = function(options) {
        let opts = processOptions(options);

        let now = opts.now || new Date();
        let texts = opts.texts || TEXTS;
        let delta = now - this;
        let future = (delta <= 0);
        delta = Math.abs(delta);

        // special cases controlled by options
        if (delta <= opts.nowThreshold) {
            return future ? texts.right_now : texts.just_now;
        }
        if (opts.smartDays && delta <= 6 * MS_IN_DAY) {
            return toSmartDays(this, now, texts);
        }

        let units = null;
        for (let key in CONVERSIONS) {
            if (delta < CONVERSIONS[key])
                break;
            units = key; // keeps track of the selected key over the iteration
            delta = delta / CONVERSIONS[key];
        }

        // pluralize a unit when the difference is greater than 1.
        delta = Math.floor(delta);
        units = texts.pluralize(delta, units);
        return [delta, units, future ? texts.from_now : texts.ago].join(" ");
    };

    let processOptions = function(arg) {
        if (!arg) arg = 0;
        if (typeof arg === 'string') {
            arg = parseInt(arg, 10);
        }
        if (typeof arg === 'number') {
            if (isNaN(arg)) arg = 0;
            return {nowThreshold: arg};
        }
        return arg;
    };

    let toSmartDays = function(date, now, texts) {
        let day;
        let weekday = date.getDay(),
            dayDiff = weekday - now.getDay();
        if (dayDiff == 0)       day = texts.today;
        else if (dayDiff == -1) day = texts.yesterday;
        else if (dayDiff == 1 && date > now)
            day = texts.tomorrow;
        else                    day = texts.days[weekday];
        return day + " " + texts.at + " " + date.toLocaleTimeString();
    };

    let CONVERSIONS = {
        millisecond: 1, // ms    -> ms
        second: 1000,   // ms    -> sec
        minute: 60,     // sec   -> min
        hour:   60,     // min   -> hour
        day:    24,     // hour  -> day
        month:  30,     // day   -> month (roughly)
        year:   12      // month -> year
    };

    let MS_IN_DAY = (CONVERSIONS.millisecond * CONVERSIONS.second * CONVERSIONS.minute * CONVERSIONS.hour * CONVERSIONS.day);

    let WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let TEXTS = {today:        'Today',
        yesterday:    'Yesterday',
        tomorrow:     'Tomorrow',
        at:           'at',
        from_now:     'from now',
        ago:          'ago',
        right_now:    'Right now',
        just_now:     'Just now',
        days:         WEEKDAYS,
        pluralize:    function(val, text) {
            if(val > 1)
                return text + "s";
            return text;
        }
    };
    return _;
})();



/*
 * Wraps up a common pattern used with this plugin whereby you take a String
 * representation of a Date, and want back a date object.
 */
Date.fromString = function(str) {
    return new Date(Date.parse(str));
};