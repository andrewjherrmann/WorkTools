function AppViewModel() {
  var self = this;
  self.CurrentPtoBalance = ko.observable();
  self.FutureApprovedPto = ko.observable();
  self.Today = moment();
  self.FirstPaydayOf2017 = moment("2017-01-06");
  self.CurrentYear = self.Today.year();
  self.Tier = ko.observable();
  self.CalcType = ko.observable("yearsOfService");
  self.EoyBalance = ko.observable(0);
  self.EoyNeedToUse = ko.observable(0);
  self.EoyNeedToUseDays = ko.observable(0);
  self.HireDate = ko.observable();
  self.HireDateMoment = function(){ return moment('2012-03-12'); };

  self.HireDateMoment = ko.computed(function(){
    var m = moment(self.HireDate());
    var yearsOfService = self.Today.diff(m, 'years');
    if(yearsOfService >= 5){
      self.Tier("5");
    } else if(yearsOfService >= 1){
      self.Tier("1");
    } else{
      self.Tier("0");
    }
    return m;
  });
  
  self.TierCalc = ko.computed(function(){
    var val;
    switch(self.Tier()) {
    case "5":
        val = 160;
        break;
    case "1":
        val = 120;
        break;
    default:
        val = 40;
    }
    return (val / 26);
  });
  
  self.PayPeriodsRemaining = ko.pureComputed(function(){
    var rollingDate = self.FirstPaydayOf2017;
    var weekCounter = 0;
    for(var i=0; i<500; i++){
      rollingDate.add(14, 'days');
      if(rollingDate.year() > self.CurrentYear){
        break;
      } else if (rollingDate.isAfter(self.Today)){
        weekCounter++;
      }
    }
    return weekCounter;
  });
  
  self.CalculateEoyBalance = ko.computed(function(){
    var currentBal = parseInt(self.CurrentPtoBalance());
    var futureApproved = parseInt(self.FutureApprovedPto());
    currentBal = currentBal ? currentBal : 0;
    futureApproved = futureApproved ? futureApproved : 0;
    self.EoyBalance(Math.round((currentBal - futureApproved + (self.PayPeriodsRemaining() * self.TierCalc())) * 100) / 100);
    self.EoyNeedToUse(Math.round((Math.max((self.EoyBalance() - 40), 0) * 100)) / 100);
    self.EoyNeedToUseDays(Math.round(self.EoyNeedToUse() / 8 * 100) / 100);
  });
}
