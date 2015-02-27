
var parser = {};
(function(){

	var weekFormatStr = 'DD/MM/YYYY';


	function getReportingWeekFor(date, model) {
		var mDate = moment(date, weekFormatStr);
		while(mDate.format('ddd') !== 'Fri') {
			mDate.subtract('days', 1);
		}
		var weekStartDate = mDate.format(weekFormatStr);

		if(!model.weeks[weekStartDate]) {
			var week = {};
			week.from = weekStartDate;
			week.to = mDate.add('days', 6).format(weekFormatStr);
			week.tasks = [];
			week.days = [];

			mDate = moment(week.from, weekFormatStr);

			for(var i = 0; i < 7; i++) {
				week.days.push({
					date: mDate.format(weekFormatStr),
					day: mDate.format('ddd'),
				});
				mDate.add('days', 1);
			}

			model.weeks[weekStartDate] = week;
			model.weeks.push(week);
		}

		return model.weeks[weekStartDate];
	}

	function addTaskToWeek(w, d, t, h) {
		var taskKey = t.replace(/[\s\.]/g, '');
		
		if(!w.tasks[taskKey]) {
			var task = {
				name: t,
				days: []
			};

			var mDate = moment(w.from, weekFormatStr);

			for(var i = 0; i < 7; i++) {
				var dateStr = mDate.format(weekFormatStr);
				var day = {
					date: dateStr,
					hours: 0 
				};

				task.days.push(day);
				task.days[dateStr] = day;

				mDate.add('days', 1);
			}

			w.tasks.push(task);
			w.tasks[taskKey] = task;
		}

		var task = w.tasks[taskKey];
		task.days[d].hours = h;

	}


	function parse(raw) {
		var model = {
			weeks: []
		};

		var lines = raw.split('\n');
		_.each(lines, function(line){
			if(/^\d\d\/\d\d\/\d\d/.test(line)) {
				console.log(line);

				var cols = line.split(',');

				var date = cols[0],
					task = cols[2],
					hours = cols[7];

				var reportingWeek = getReportingWeekFor(date, model);
				addTaskToWeek(reportingWeek, date, task, hours);
			}
		});
		return model;
	}

	parser.parse = parse;


})();



angular.module('myApp', []).controller('timesheetController', ['$scope', function(scope) {
  

	scope.datacomTime = '';
	scope.model = null;

	scope.import = function() {	
		var raw = scope.datacomTime;
		//console.log(lines);
		scope.model = parser.parse(raw);

	};


}]);


