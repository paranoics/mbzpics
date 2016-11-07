_satellite.pushAsyncScript(function(event, target, $variables){
  if (digitalData.page.content.milestonesTotal) {
 s.milestone_relation = this.getAttribute("data-analytics-content-milestone")/digitalData.page.content.milestonesTotal;
  }
  else {
  s.milestone_relation = 0
}


if (s.milestone_relation > 0.90 && s.milestone90_already_fired === false) {
  s.prop70 = s.milestone_relation;
  s.t();
  
  s.milestone90_already_fired = true;
}
else if (!s.milestone90_already_fired) {s.milestone90_already_fired === false;}
});
