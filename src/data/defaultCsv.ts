export const defaultCsvData = `ID,Title,Description,Project,Module,Priority,Severity,Status,Assignee,Reporter,Reported Version,Target Fix Version,Reproduction Steps,Expected Behavior,Actual Behavior,Root Cause Analysis,Resolution Notes,Comments,Image URL,Created At,Updated At
1,FLL SANDBOX if i remove the location permission for atlas i am unable to logout on Android device,,,,,,,,,,,,,,,,"discussed with PJ - Ignore  for now we will catch in CP
 | Platform:",,,
2,White space remains after closing the keyboard on the Failure Reporting screen,,,,,,,,,"CPv3.0.0.0.25a, STPSAML,TEST, Android tab A9+.",,"1. Login to Atlas.
2. Start any Work Order.
3. Navigate to the Failure Reporting section.
4. Add Failure Class, Problem, Cause, and Remedy.
5. Tap on the Remark field → Keyboard opens.
6. Close the keyboard.
",,"After the keyboard is closed, a white space remains on the screen, and the user must scroll to bring the Remark field back into view.",,,Unreported | Platform:,,,
3,Added item data appears blank after ntw fluctuation.,,,,,,,,,"Cpv4.0.0.0.6b, STP, TEST, Android, Windows, iOS",,"1.Login to atlas start wo with partial GL
2.Go to materials section and add two material req 1 3.with self issue 1 without self issue.
4.click on save button and immediately off ntw 
5.add another 2 item req as above 
6.Click on failure reporting tab
7.again click on material and then item",,"no item line appers in hash mark, still save button is displayed and storeroom set to default.
",,,Unreported | Platform:,,,
4,GL account button appears read-only,,,,,,,,,,,"1.Login to atlas start wo with partial GL
2.Go to materials section and add two material req 1 with self issue 1 without self issue.
3.click on save button and immediately off ntw 
4.ON ntw
5.discard error appears for partial GL 
6.Click Go Back
7.then click back on item screen
",," GL account button displays inactive or read only

",,,Unreported | Platform:,,,
5,"Material Quantity window item description for material displays item instead of material.
",,,,,,,,,"V4.1c, EDI, TRAIN, Android",,"1.Login to Atlas
2.Start WO
3.Click on reconciled material 
4.click on view edit",,"Description says Item
                           Material1 (On next line)

",,,Unreported | Platform:,,,
6,iPhone Application get crash,,,,,,,,,"v4.0, STP, TEST, iPhone",,"1.Login to Atlas
2.Swip left to right on screen to open hamburger menu ",,Observed: Half map and half screen login page displyas ,,,Unreported | Platform:,,,
7,iPhone Application get crash,,,,,,,,,"v4.1e, EDI, TRAIN, iPhone",,"1. Login to Atlas.
2. Create new WO| Without job plan
3.Start same WO
4.Click on TT drawer and click Log out.
5.Click OK on labour transaction window.
6.immediatly off screen when labour transaction window closes and white screen displyas.
7.Again on screen and onpen Atlas App.
",,The app screen open with half map and half white.,,,Unreported | Platform:,,,
8,The base map appears after the ideal timeout for the server map.,"In webtool Set GIS login method to 'Named Users', and set Fallback to true.",,,,,,Mayur Sir.,,"CPv4.0.0.0.12c, INSP, Test, Windows.",,"1. Log in to Atlas.
2. 2. Click the Login button on the map.
3. Enter a valid username and password.
4. Select the Remember Me checkbox.
5. Click Sign In.
Result: The original map is displayed as expected.
6. Set a low idle timeout.
7. Re-log in after ideal time out.
",,The Base map has appeared.,,,Internally | Platform:,,,
9,Base map appears when switch module in offline.,"In webtool Set GIS login method to 'Named Users', and set Fallback to true.",,,,,,Mayur Sir.,,"CPv4.0.0.0.12c, INSP, Test, Windows.",,"1. Log in to Atlas and navigate to the inspection module.
2. Click the Login button on the map.
3. Enter a valid username and password.
4. Select the Remember Me checkbox.
5. Click Sign In.
Result: The original map is displayed as expected.
6. Go offline and switch to work order module.
7. Go Online.",,Base map with previously loaded layer displayed.,,,Internally | Platform:,,,
10,"
Reproduced.
Implement having map pins without GIS authentication information - REQ-2449","In webtool Set GIS login method to 'Named Users', and set Fallback to true.",,,,,Fixed,Vaishnavi,,"CPv4.0.0.0.12c, INSP, Test, Windows.",,"Scenario 1:
1. Log in to Request with valid credentials.
2. Open the form.
3. Click on the map icon.
4. Long-press on map.
Observation: Long-press not work on base map.

Scenario 2: (Applicable for both STP and INSP)
1. Access the form by QR code.
2. Click on map icon.
3. Long-press on map.
Observation: Long-press not work on base map.
",, Long-press not work on base map.,,,Internally | Platform:,,,
11,Inventory Module Not Visible for User After Supervisor Access Removed from web tool,"webtool  Site has no access and Organization has access to Supervisor Module
",,,,,,Vaishnavi,,"CPv4.0.0.0.14, EDI, TEST, Windows",,"1.Log in to Atlas
2.Click on hamburger menu.

",,Inventory module is not displayed even though Inventory access is available.,,,Internally | Platform:,,,
12,Inventory Users Unable to Login on Android,,,,,,,Vaishnavi,,"CPv4.0.0.0.14, STP, TEST, Android",,"1.Launch the ATLAS mobile app.
2.Enter valid credentials for ESAMINVENTORYSUP or ESAMINVENTORYCLERK.
3.Tap Sign In.",,"After clicking Sign In, the user is not logged in. The screen is split, with the Sign In window displayed on one side and the Map window displayed on the other.",,,Internally | Platform:,,,
1,Round number displays wrong list as compare details view,Round with atlist one stop.,,,,,Fixed,,,v4.2q,v4.2r,Start Round.,,Round number displays wrong list as compare details view,,,"Platform: Windows, iOS, Android",,,
2,Round number missing in labor tab,Round with atlist one stop.,,,,,Fixed,,,v4.2q,v4.2r,Start Round.,,Round number missing in labor tab,,,"Platform: Windows, iOS, Android",,,
3,Stop sequence displays wrong. In Maximo there is no sequence metioned.,Round with at list one stop.,,,,,Fixed,,,v4.2q,v4.2r,Start Round.,,Stop sequence displays wrong. In Maximo there is no sequence metioned.,,,"Platform: Windows, iOS, Android",,,
4,Description background should white,Round with at list one stop.,,,,,Fixed,,,v4.2q,v4.2r,"1.Start Round.
2.Click on detail button.",,Description background dispalys black.,,,"Platform: Windows, iOS, Android",,,
5,In sync popup round number displays wrong. As I started round number is 1565.,Round with at list one stop.,,,,,Fixed,,,v4.2q,v4.2r,"1.Start Round.
2.Mark task.
3.Click on save button and open sync pop-up",, Round number displays wrong. ,,,"Platform: Windows, iOS, Android",,,
6,Mark task using skip&Next button and highlight the task then task description not visible properly,Round with at list one stop.,,,,,Fixed,,,v4.2q,v4.2r,"1.Start Round.
2.Mark task.",,Description not visible properly,,,"Platform: Windows, iOS, Android",,,
7,Save button getting disappears. If I select complete&Next button and again click on skip&next button for the same task,Round with at list one stop.,,,,,Fixed,,,v4.2q,v4.2r,"1.Start Round.
2.Mark task.(complete&Next )
3.Mark task.(skip&next)",,Save button getting disappears.,,,"Platform: Windows, iOS, Android",,,
8,If enter gauge meter reading more than 3digit after decimal point and getting popup again enter valid reading then Save button getting disappears ,Round with at list one stop.,,,,,Fixed,,,v4.2q,v4.2r,"1.Start Round.
2.Add guage meter value more than 3 digit
3.Save pop-up
4.Again add valid value ",,Save button getting disappears.,,,"Platform: Windows, iOS, Android",,,
9,Also again enter  value and switch the task and back to previous task then entered value and save button not display.,Round with at list one stop.,,,,,Fixed,,,v4.2q,v4.2r,"1.Start Round.
2.add meter value
3.click on another task
4.Again click on previous task",,Added value and Save button getting disappears.,,,"Platform: Windows, iOS, Android",,,
10,We can't scroll the round description to see the all value,Round with at list one stop.,,,,,Not reproduced. ,,,v4.2q,v4.2q,"1.Start Round.
2.Click on detail button.",,Can't scroll the round description to see the all value,,,"Platform: Windows, iOS, Android",,,
11,Enter long value in gauge and save then discard error popup displays twice. when discard the popup user still stay on details view.Clicking back the round list displays blank.,Round with at list one stop.,,,,,Fixed,,,v4.2q,v4.2r,"1.Start Round.
2.Add guage meter value more than 3 digit.
3.Save.
4.Discard error.
5.Click back to list view",,when discard the popup user still stay on details view.Clicking back the round list displays blank.,,,"Platform: Windows, iOS, Android",,,
12,Location and asset number display form left side round stop.,Round with One location and one asset meter.,,,,,Fixed,,,v4.2q,v4.2r,Start Round.,,Location and asset number display form left side round stop.,,,"Platform: Windows, iOS, Android",,,
13,"On iPhone, the Details pop-up displays the irrelevant  Description work group and recommended frequency values.",Round with at list one stop.,,,,,Fixed,,,v4.2q,v4.2w,"1.Start Round.
2.Click on detail button.",,Details pop-up displays the irrelevant  Description work group and recommended frequency values.,,,Platform: iPhone,,,
14,"When we add round stop description from Maximo, in Atlas still location and asset description displays.",Round with at list one stop.,,,,,Fixed,,,v4.2q,v4.2r,Start Round.,,location and asset description displays instead of added.,,,"Platform: Windows, iOS, Android",,,
15,iPhone: Unable to add decimal values for gauge meter,Round with at list one stop.,,,,,Fixed,,,v4.2q,v4.2w,"1.Start Round.
2.add meter value in decimal",,Unable to add decimal values for gauge meter,,,Platform: iPhone,,,
16,"When I give new reading which includes 0 in it to gauge meter. (for e.g. 50). and go back to list view without saving, and after again removing the value from the field and save it. I get the last reading as 5 not 50",Round with at list one stop.,,,,,Fixed,,,v4.2q,v4.2r,"1.Start Round.
2.add guage meter value (ex 50)
3.Click go back to list
4.Start same round 
5.Rmove added value.
6.Click on save button",,Save button not get removed after removing value and if save then 5 value display in privious reading,,,Platform: iOS.,,,
17,"If round has no stop then the message should displays ""No task available"" in portrait view as landscape.",Round with-out stop.,,,,,Fixed,,,v4.2q,v4.2w,Start Round.(Shift to portrait view),,"""No task available"" in portrait view as landscape.",,,"Platform: Windows, iOS, Android",,,
18,Stop right section shows white (header section disappear),Round with-out stop.,,,,,Fixed,,,v4.2q,v4.2w,Start Round.(Shift to portrait view),,Stop right section displays white ,,,"Platform: Windows, iOS, Android",,,
19,"When i add status to 1 st round stop and then 2 and again changed 1st round stop status (ex 1st round stop 1st status added COMP and Next then add 2nd stop status COMP and next, now again add new status to 1st stop Skip and next) stop choise not shift to 2nd even i clicked on Skip and next.",Round with at list one stop.,,,,,Fixed,,,v4.2q,v4.2w,"1.Start Round.
2.Mark 1 st task.(complete&Next )
3.Mark 2nd task.(complete&Next )
4.again mark 1st task.(save&Next )",, stop choise not shift to 2nd even i clicked on Skip and next.,,,"Platform: Windows, iOS, Android",,,
20,"Round stop description doesn't wrap if I use ""&NBSP; tag contains (horizontal scroll occurs). also extra comma show before the word.",Round with discription for task includes &nbsp; tag.,,,,,Fixed,,,v4.2q,v4.2w,Start Round.,,"Round stop description doesn't wrap if I use ""&NBSP; tag contains (horizontal scroll occurs). also extra comma show before the word.",,,"Platform: Windows, iOS, Android",,,
21,"If I create the same duplicate round of the previous round that is in the list, then start and mark the round stop status.",,,,,,Fixed,,,v4.2q,v4.2w,"1.Craete 1st round mark task and save 
2. Create Duplicate of 1st round and mark task",,Hash mark does not appear for the status applied to tasks.,,,"Platform: Windows, iOS, Android",,,
22,"AWM-15686
Continue spinning wheel appears.",Round has one or more stop.,,,,,Final review,,,v4.2q,v4.2w,"Scenario 1:
1.Sign In.
2.Start round as condition.
3.Make any changes like complete or skip the stop. | Save button appears as expected.
4.Click back to rounds list.
5.Click Save.
Scenario-2
1.Sign In.
2.Start round as condition. | In details view 1st stop displays as selected
3.Click On Labor or Complete tab.
4.Click back to task stop",,Continue spinning appears.,,,Platform: Android,,,
23,"AWM-15693
Background sync, doesn't work properly.",,,,,,OPEN,,,v4.2q,,"Scenario 1:
1.Start any round.
2.Mark any stop round with any status.
3.Click Save.
4.While sync, mark another stop round.
Scenario 2:
1.Start any round.
2.Mark any stop round with any status.
3.Click Save.
4.While sync, add meter reading.",,"Scenario 1
Observed: Newly marked stop round shows in hashmark but save button doesn’t display at the top to save latest changes.
Scenario2
Observed: Newly added meter reading disappears.",,,Platform: iOS.,,,
24,"AWM-15687
When clear the entered meter data and switch the tab then removed data reappear",Round has one or more stop with meter.,,,,,Final review,,,v4.2q,v4.2w,"Scenario 1:
1.Sign In.
2.Start Round.
3.Enter meter reading. | Save button displays as expected.
4.Remove the entered reading by click on X button. | Save button disappear as expected.
5.Switch stop.
6.Back to previous stop.
Scenario 2:
1.Follow the same steps 2 to 6 as metioned in scenario 1.
2.Click on Skip & Next button for any stop. | Save button displays as expected.
3.Remove the previously entered value in the meter field on steps 6.

Scenario 3 from Pradnya: After Idle timeout Tasks are not displayed in hashamrk and also meter reading is not displayed.

Precondition- Set low idle timeout.
1.Login to Atlas and Start Round. 
2.Mark the task and Enter meter reading.
Wait for the idle timeout.
3.Relogin and start the same round. ",,"Scenario1
Observed: Reappear previously entered value in the meter field.
Scenario2
Round stop displays in hashmark and save button getting disappears.
Scenario3
Save button is displayed as expected but Tasks are not displayed in hashamrk and also meter reading is not displayed.",,,Platform: Android,,,
25,"AWM-15689
Enter long value in gauge meter and clear it, the save button remains on to and able to save the reading",Round has stop with gauge meter.,,,,,Final review,,,v4.2q,v4.2w,"Scenario 1:
1.Select Round that has gauge meter.
2.Enter long digit value in meter field.
3.Clear the entered value.
Scenario 2:
1.Select Round that has char meter.
2.Select any reading in list. | value appears in the field as expected.
3.Again, change different reading without clearing previous reading.
4.Clear the entered value.",,"Scenario1
Save button remains on top and able to save the reading after clicking on save. 
Scenario2
Save button remains on top and able to save the reading after clicking on save. ",,,Platform: iOS.,,,
26,"AWM-15698
Offline data sync, round stop sequence getting changed and round status mark getting disappears","The round has 4 stops with description. Sequence numbers have been added for 2 tasks, while the sequence field is left blank for the remaining 2 tasks.",,,,,TO DO,,,v4.2r,,"1.Start round as condition. | Round stop sequence display properly as Maximo.
2.Do offline data sync for started round.",,"Round stop sequence getting changed.

Marked status getting disappear for stops.",,,Platform: iOS.,,,
27,"AWM-15695
If round has no stop then there is no message ""No task available"" in portrait view as landscape.",Round with at list one stop.,,,,,Final review,,,v4.2r,v4.2w,,," If round has no stop, then there is no message ""No task available"" in portrait view as landscape.",,,Platform: iOS.,,,
28,"AWM-15696
Status Sign Remains Visible After Clearing Status.",Create a Round in Maximo with 2–3 round stops.,,,,,Final review,,,v4.2r,v4.2w,"1.Log in to Atlas and navigate to the Round module.
2.Start the round
3.Update the status for one or more tasks.
4.Navigate back to the Rounds List.
5.Start the same round again and tap Clear Status.
Scenario2
1.Start the round.
2.Update the status for one or more tasks.
3.Click Save.
4.Click on Clear Status.",,"Scenario 1
Task status is not getting updated and the hashmark goes away but the sign still stays.
Scenario 2
The task status is not cleared after Clear Status.",,,Platform: iOS.,,,
29,"AWM-15694
Round stop, header section from right section getting disappear",,,,,,Final review,,,v4.2r,v4.2w,"1.Start round that has no stop.
2.Change orientation to portrait.
3.Click on labor tab.
4.Click back task stop.
5.Change orientation to landscape.",,Right section shows white and header get disappear.,,,Platform: Android,,,
30,"AWM-15691
Round Stop, the long description is available for both the Asset and Location in Maximo. However, the long description is not displayed in Atlas. Instead, no long description is shown",Location and Asset has long description.,,,,,TO DO,,,v4.2q,,"1.Start Round.
2.Click on round stop.
3.Click on Long description icon.",,"No long description available"" popup displayed.",,,Platform: iOS.,,,
31,UOM is not getting upadte for guage meter,Round stop with guage m,,,,,Fixed,,,v4.2r,v4.2w,"1.Start Round.
2.Click on task which has guage meter.",,UOM is displayd irrelevant.,,,Platform: iOS.,,,
32,"If Add meter for two stops and wait for idle, after relogging I cleared one meter reading the save button getting disappear and one meter reading with hashmark show for 2nd stop.",Round meter with 2 tasks,,,,,Fixed,,,,v4.2w,"1. Start Round.
2.  Add meter values to 2 tasks
3. set low ideal timeout.
4. Login and start same round.
5. Remove the value of 1st task meter",,Hash mark does not appear for the 2nd task which has added meter value.,,,Platform: iOS.,,,
33,"Clear Status works as ""Clear and Next""",Round meter with 2 tasks,,,,,Fixed,,,v4.2s,v4.2w,"1.Start Round and add status.
2.Click on save.
3. Click on clear status.",,When you click on Clear status it shift to next task ,,,Platform: iOS.,,,
34,After ideal timeout if i remove status of task hashmark get removed,Round with tasks,,,,,Fixed,,,v4.2s,v4.2w,"1. Start Round.
2.  Add meter values to task and mark status for both
3. set low ideal timeout.
4. Login and start same round.
5. Remove the value or status of task meter",,Hash mark does not appear for the task which has added meter value.,,,Platform: iOS.,,,
35,Task Field Not Displayed for Non-Default Task,"1.Round has multiple tasks.
2.Select a task other than the default task.",,,,,Fixed,,,,v4.2w,"1.Log in to Atlas
2.Click on round and start the round
3.observe detail view
4.Select any task other than the first task.
5.go back to detail view and and observe ",,"When a task other than the default task is selected, the Task field is not displayed in the Detail View. It is displayed only for the default task.
",,,Platform: Andriod S25,,,
36,Tak status get saved directly no hashmark and save button,Round with tasks,,,,,Fixed,,,v4.2s,v4.2w,"1. Start round .
2. Add status to all stops.
3. Save.
4. Clear all task status.
5. Add status to 1st task(COMP & Next)
6. Change same task status to(Skip & Next)
7. Go back to list.
8. Start same round.
9. Chage Status for same task.",,last updated status appers without hashmark and no ave button on top right.,,,Platform: Android,,,
37,If ideal timeout in not honnerd then half screen map and half screen round detail view is displayed,Round with tasks,,,,,Fixed,,,v4.2s,v4.2w,"1. Start Round.
2.  Add meter values to 2 tasks
3. set low ideal timeout.",,Half screen map and half-screen round detail view is displayed ,,,"Platform: iOS, Android",,,
38,"After clear status, task are not
 displayed in hashmark and previous task status is displayed after save",Round with tasks,,,,,resolved,,,V4.2w,,"scenario 1:
steps:
1]. start round
2]. give status and save.
3]. while syncing give status to the another task.
4]. clear all the status by doing clear status button.

Scenario2:
steps:
1]. do the steps same as scenario 1.
2].  Click save.",,"scenario 1: task status is not displayed in hashmark.

scenario 2: the previous task status is still displayed after clear.",,,Platform: iPad,,,
39,"Task status not updating after 
doing clear status actions",Round with tasks,,,,,Resolved,,,V4.2w,,"1]. start round
2]. give task status(ex. comp & next )and save
3]. clear the same status and again give (skip & next) without saving
4]. save",,status gets clear,,,Platform: iPad,,,
40,Last Reading Inspector field Not Displayed Properly,A meter with a long Last Reading Inspector name is available.,,,,,Resolved,,,V4.2w,v4.2x,"1.Log in to Atlas
2.Click on round and start the round
3.view the round
4.observe Last Reading Inspector field",,"When the username is long, the Last Reading Inspector name is not displayed properly.",,,Platform: Andriod S25,,,
41,Clear status not work properly,Round with tasks,,,,,Scenario 1: fixed Scenario 2: Resolve,,,V4.2z,,"1.Start round and mark all task.
2. Save, and while syncing mark the 1st task again with diff status.
3. After sync, Clear status of 1st task which is added during sync.
4. Clear all task status 1 by 1 and click on save.
-----------------------------------------------------------------------------------------------
New Scenario:
1. Start round.
2. Give status to all tasks| Save.
3. While syncing give another task status to the same tasks| Save.
4. Now while syncing clear the status of all tasks. (Save button and hashmark displays as expected).
5. Save.",,After clearing all status still privious status are displayed for all tasks,,,"Platform: iOS, Android, Windows",,,
42,Continuous Spinning wheel appears,Round with 4 tasks,,,,,resolved,,,V4.2z,,"1. Start round.
2. Give task status to task 1 and 2.| save.
3. while syncing give task status to another task(task 3 and 4)
4. Do clear status to the same task(task 3 and 4) without saving.
(observed: hashmark is not displayed).
5. Save.
",,Non stop spinning wheel appears.,,,Platform: All Platforms,,,
43,Hash mark is not displayed for Clear Status after offline data sync.,Round with tasks,,,,,OPEN,,,v4.2ac,,"1.Start a round, mark all tasks, and save.
2.Perform an offline data sync for the same started round.
3.After the sync is completed, clear the status of all tasks.",,The hash mark is not displayed after performing the Clear Status action.,,,Platform: Android,,,
44,Discard message is displayed twise for detail view and list view as well.,Round with tasks,,,,,OPEN,,,v4.2ad,,"1. Start Round.
2. Add invalid value to meter.
3. Discard message is displayed as expected. 
4. Delete that discard messgae.
5. User will go to list view.",,Again that disccard message is displayed.,,,Platform: Windows,,,
45,If we give task status and go back to list view. The task status is auto-saved.,Round with tasks,,,,,OPEN,,,v4.2ad,,"1. Start a round.
2. Mark the task with any status.
3. Go back to the List view.",,The task status is auto-saved.,,,Platform: All Platforms,,,
46,"After Clear status, Save button
 still remains on top",Round stop without a meter.,,,,,Resolved,,,V4.2ae,,"1]. Start Round.
2]. Mark complete and next for all task.
3]. Click forward arrow until to complete tab.
4]. Clear the all task status.",,"Save button remain on top. click on save, 
sync InProgress show with blank popup.",,,Platform: All Platforms,,,
47,Round is not displayed in hashmark after idle time out.,"Round stop with meters and
 Set low idle timeou",,,,,OPEN,,,V4.2af,,"1]. Start Round.
2]. Add meter reading also update task status then Save button is displayed.(as expected).
3]. After idle timeout login to Atlas.",,Round is not displayed in hashmark after idle time out.,,,Platform: Windows only,,,
48,Stops sequence getting changed after idle timeout.,"Round Stops with meters and 
set low idle timeout.",,,,,,,,V4.2af,,"1]. Start Round.
2]. Mark the task skip and complete| Save.
3]. Clear the status or change the status for same task.
4]. Go back to list view.
5]. After idle timeout login to Atlas.
6]. Start the same round.",,Stops sequence getting changed.,,,Platform: All Platforms,,,
49,"Task status still displayed after
clear status.",Round Stop without meters,,,,,OPEN,,,V4.2ag,,"1]. Start Round.
2]. Mark complete and next for all task.
3]. Click forward arrow until to complete tab.
4]. Clear the all task status. | Save button disappears as expected.
5]. Go back to list view and start the same round again.",,"Task status is still displayed 
though it was cleared.",,,Platform: All Platforms,,,
50,"Long description for Assest/loc 
is not displayed in potrait mode.","Round with stops having Long 
description to assest/loc.",,,,,OPEN,,,V4.2ag,,"1]. Start Round.
2]. Click on round stop.
3]. Click on Long description icon || Long description displayed in landscape as expected.
4]. Click on X on long description tab.
5]. Switch to potrait mode.
6]. Click on Long description icon.",,"The Long description for stops
 assest/loc is not displayed in potrait mode.",,,Platform: All Platforms,,,
51,start round popup windows shows again after idle timeout,Round Stops with meters,,,,,,,,V4.2ah,,"1]. start round 
2]. mark stops with any status.
3]. wait for idle in detail view
4]. log back in
5]. select same and try to start the round",,"Again start round popup 
windows shows.",,,Platform: Windows only,,,
0,"network flux not working
properly",Round stops with meters,,,,,,,,v4.2ah,,"1]. Start round.
2]. mark 3/4 task with any status.
3]. Click save.
4]. while save turn internet off and on.
5]. when on the internet, quickly mark another task with any status.",,"previous change with new 
change get save at the same time. for new changes save button with hashmark should be display.",,,Platform: iOS,,,
53,"Meter reading is not saved
 when network fluctuates during sync",Round stops with meters,,,,,,,,V4.2ah,,"1]. Start round.
2]. Add meter value.
3]. Click the save button and click Yes 
on the confirmation pop-up.
4]. While sync fluctuate the network.",,"Meter reading still displayed in 
new reading field, and no save 
button on top",,,Platform: Android,,,
54,"Save button is still displayed 
after removing the value for the meter.",Round stops with meters,,,,,,,,V4.2ai,,"1].Start round.
2]. Add Meter value to gauge meter or continuous meter.
3]. Now clear the Meter value",,Save button is still displayed.,,,Platform: All Platforms,,,
55,Continue spinning appears,Round stops with meters,,,,,,,,V4.2ai,,"1]. Start round
2]. Click round complete from complete section.
3]. Yes to confirm.
4]. Cancel the labor popup.
5]. Back to list.
6]. Again start the same round.
7].Click round complete from complete section.
8]. Yes to confirm.
9]. Cancel the labor popup.
10]. Click Ok on the labor windows.
11]. After save, restart the same round.
12]. Mark any task with any status.
13]. Click Save.",,Spinning appears on save.,,,Platform: iOS only,,,
56,"Two time save button appears
 to save the changes",Round stops with meters,,,,,,,,V4.2ai,,"1]. Add labor record.
2]. Mark any task.
3]. Click Save.",,"Only labor entry get saved and 
save button again appears to
 save the changes for task status.",,,"Platform: iOS, Android",,,
57,"Continuous spinning wheel 
appears.",Round stops with meters,,,,,resolved,,,V4.2aj,,"1]. Start the round.
2]. In Atlas Perform Offline data sync for the same round.(from detail view)
3]. Again click on Offline data sync option. and close the offline data sync window. ",,"Continuous spinning wheel 
appears.",,,Platform: Windows,,,
58,"Spinning wheel is appears on
 details view.",Round stops with meters,,,,,resolved,,,V4.2aj,," 1]. Start round.
2]. From menu select offline data sync option
3]. Select round list check box only
4]. Click sync data button
",,"Observed: Continue spinning

Note: working in list view",,,Platform: iOS,,,
59,"Min:Hr numbers vanish after 
adding labor.",Round Stops with meters,,,,,resolved,,,v4.2aj,,"1.Start Round
2.Click on labor tab
3.Click on Add Labor button
4.Fill all fields in the Add Labor Transaction window. and click on ok button
5.save",,"Min:Hr is visible before adding 
labor but vanishes from all entries after adding a new labor.",,,Platform: Android,,,
60,"00min show on save button
 insted of last change time.","Set default module work order
 and low idle time.(1min or 2min)",,,,,resolved,,,v4.2ak,,"1. Sign In.
2. Start round.
3. Mark any stop with any status.
4. Wait for idle.
5. After re-login, see the save button time. ",,"00min show on save button
 insted of last change time.",,,Platform: Android,,,
61,Round shows in hashmark,"Set default module work order
 and low idle time.(1min or 2min)",,,,,resolved,,,v4.2ak,,"1. Sign In.
2. Start round.
3. Mark any stop with any status.
4. Wait for idletimeout.
5. After re-login, Click On Save button.
6. Switch to round module.",,"Round shows in hashmark. 
even we save the changes",,,Platform: Android,,,
62,"Labor record is not displayed 
which is added during sync (AWM-15721)",Round stops with meters,,,,,resolved,,,V4.2ak,,"1. Start round.
2. Go to labor section 
3. Add labor 1 or more than one and click on save button.
4. while sync add another record.",,"Save button displays as expected
 but new labor record is not 
displayed which is added during sync.",,,Platform: All Platforms,,,
63,"Labor shows in hashmark and
 entered meter reading remain
 in field",Round stops with meters,,,,,resolved,,,v4.2al,,"1]. Start round.
2]. Add 2 or more labors and enter meter reading.
3]. Click Back to list.
4]. Click Save.
5]. While sync, Restart the same round",,"Added labor shows in hashmark 
and entered meter reading 
remain in field.",,,Platform:,,,
64,"Hashmark is not displayed for 
the task and previous Task status is displayed.",Round with 4 stops,,,,,resolved,,,v4.2al,,"1]. Start Round.
2]. Mark 4 task as Complete.
3]. Click on save button and Quickly 
fluctuate the network.
4]. Now mark 1st task as Skip.(Once Hashmark gets removed for the task)",,"Hashmark is not displayed for 
1st task and previous Task status is displayed",,,Platform: Windows,,,
65,"Unable to add decimal values 
on continuous meter","Round Stop with continous 
meters",,,,,resolved,,,V4.2al,,"1]. Start Round
2]. Try giving decimal value to continous meter",,Unable to add decimal values on continuous meter,,,Platform: iPhone,,,
66,"Directly save the lates entered
 reading, there is no save and 
hashmark (AWM-15732)",Stop with multiple meters,,,,,,,,v4.2am,,"1]. Start Round.
2]. Add multiple meter reading
3]. Click on save button
4]. while sync quickly fluctuate the network.
5]. Add new meter reading",,"Latest meter reading gets save
 with previous meter reading",,,Platform: iOS,,,
67,"offline data sync not working
 properly",Round with meters,,,,,resolved,,,v4.2am,,"1]. Add new round in Maximo.
2]. Do offline data sync for round
Observed: Newly added round doesn't
 display in the list.
3].Again do offline data sync
Note: now the latest record display in list.",,"Observed: Newly added round 
doesn't display in the list.

Note: Same observation 
applicable when I remove round in Maximo and do offline data sync in atlas.",,,Platform: iOS,,,
68,"Discard button is still displayed 
for labor less than 24 hours and allows switching rounds with discard",Round with meters,,,,,resolved,,,V4.2am,,"1]. Start a round.
2]. Go back to the list.
3]. Switch to another round.
4]. Verify that the Labor Transaction window is displayed.
5]. Add labor hours exceeding 24 hours.
6]. Verify that the expected error message is displayed.
7]. Click the Back button.
8]. Add labor hours less than 24 hours.",,"The Sync Error/Discard button
 is still displayed, and the user is able to switch to another round",,,"Platform: android, iOS",,,
69,"Hashmark is not displayed to 
stop after updation.",Round with meters,,,,,resolved,,,V4.2am,,"1]. Start round.
2]. Add meter value to Marked stop.(ex. gauge meter)
3]. Update the marked Stop status.(ex. complete&next to skip&next again to complete&next).
4]. Remove the added value from meter for the same stop.",,The hashmark gets disappear for the stop status.,,,Platform: iPad Air,,,
70,"Multi user stop status updation
 issue 1",Round with meters,,,,,resolve,,,v4.2am,,"1]. Sign in to device A as user A (Esamtechinsp3) and start a round.
2]. Sign into device B as user B (Esamtechinsp4) and start the same round.
3]. As user A, mark a round stop as skipped and save.
4]. As user B, mark the same round stop as complete and save.
5]. As user B, mark the round stop as clear status and save. 
6]. Again, As user B, mark the all round stop as skipped status and save. 
7]. As user A, mark all the round stop as complete and save",,"For User A First stop still shows 
as skipped. It should show complete as latest status save.",,,Platform: iOS and android,,,
71,"Multi user stop status updation
issue 2",Round with meters,,,,,,,,v4.2am,,"1]. Sign in to device A as user A (Esamtechinsp3) and start a round.
2]. Sign into device B as user B (Esamtechinsp4) and start the same round.
3]. As user A, mark the all round stop as skip and save.
4]. As user B, mark the all round stop as comp and save. 
5]. As user B, mark the alternate round stop as clear status (like 1st, 3rd, 5th till stop end)and save. 
6]. As user A, mark the alternate round stop as clear status (like 2nd, 4th, 6th till end)and save.| all status get cleared as expected.
7]. Again, for user A mark the alternate status as complete and skip like wise.
8]. As user B, user B mark the round stop as clear which were  already completed and save.",,For user B all the changes reflected from A user.,,,Platform: iOS and android,,,
72,"After discard save button is not
 displayed for updated meter reading.",Round with meters,,,,,,,,v4.2an(Internal),,"1]. Start a round.
2]. Add a character value to a meter.
3]. On the same task, add a continuous meter reading with an invalid value.
4]. Click Save and select Yes on the confirmation pop-up.
5]. Quickly fluctuate the network connection.
6]. Verify that the Discard pop-up is displayed for the invalid continuous meter reading.
7]. Click Go Back on the Discard pop-up.
8]. Update the continuous meter reading with a valid value.",,The Save button is not displayed after updating the continuous meter reading,,,Platform: Windows.,,,
73,Warning pop-up is not displayed for a continuous meter reading,"The round task has at least one 
continuous meter.",,,,,,,,v4.2an(Internal),,"1.Start the round.
2.Enter a continuous meter value that is lower than the previous meter reading.
3.Click anywhere on the window.",,"The warning pop-up is not displayed with the message:
""Value of # entered is less than the last recorded value ##. Do you want to accept this value?""
The Yes and No buttons are also not displayed.",,,Platform: Windows,,,
74,"Save button still displayed on 
List view after Logout",Round with meters,,,,,,,,V4.2an,,"1.Log in
2.Click on Start round
3.click ok on start time window
3.click back to Round list
4.click logout and select yes
5.Click ok on Transaction windows
6.Turn Wifi off and on
7.Relogin ",,Save button is still display on list view after relogin ,,,"Platform: Android, iOS",,,
75,"The Labor entry is displayed 
with a hash mark (#).",Round with meters,,,,,,,,V4.2an,,"scenario 1:
1]. Click Start Round and then click the Calendar button.
2]. Select a date and time earlier than the current date/time (e.g., 72 hours earlier).
3]. Click OK.
4]. Navigate to the Complete section.
5]. Click Stop Work and click OK on the Labor pop-up.
6]. The Discard pop-up appears.
7]. Click Go Back on the Discard pop-up.
8]. Click X on the Labor window.
9]. Navigate to the Labor tab.

Scenario 2: Network Fluctuation
1]. Click Start Round and then click the Calendar button.
2]. Select a date and time earlier than the current date/time (e.g., 72 hours earlier).
3]. Click OK.
4]. Navigate to the Complete section.
5]. Click Stop Work and click OK on the Labor pop-up.
6]. Quickly fluctuate the network connection.
7]. Click Go Back on the Discard pop-up.
8]. Click X on the Labor window.
9]. Navigate to the Labor tab.

Scenario 3: Network Fluctuation
1.Click Start Round and then click the Calendar button.
2.Select a date and time earlier than the current date/time (e.g., 72 hours earlier).
3.Click OK.
4.Navigate to the Complete section.
5.Click Stop Work and click OK on the Labor pop-up.
6.Quickly fluctuate the network connection..| After network fluctuation, user is directly navigates from Detail View to List View. 
7.Click Go Back on the Discard popup,
Observed:  the Discard popup appears 3 times
7.Click go back on each dicard popup 
8.start same round",,"Scenario 1:
The Labor entry is displayed 
with a hash mark (#).


Scenario 2:
The Labor entry is displayed with a hash mark (#) for approximately 1 second and then disappears from the list.

Scenario 3:
User can still start the round even though the sync error is displayed.",,,Platform: Android,,,
76,"User is not navigated to the 
Detail View after starting another round",Round with meters,,,,,open,,,v4.2ao,,"1]. start a round.
2]. Click Back to List View.
3]. Select another round and click Start.| The Labor pop-up for the previous round is displayed.
4]. Click OK on the Labor pop-up and immediately toggle the network Off/On.
5]. Click OK on the Start window.
6]. Wait for 2–3 seconds for the list to refresh.",,The user remains on the List View even though the second round has been started.,,,Platform: iOS,,,
77,"Continue Spinning appears on 
save button.",Round with meters,,,,,open,,,v4.2aO,,"1]. Start a round.
2]. Navigate to the Labor section and add one labor record.
3]. Click Back to List View.
4]. Click the Save button and select Yes on the confirmation pop-up.
5]. Immediately toggle the network Off/On.
6]. After the network reconnects, the list view refreshes and the Save button is displayed at the top.
7]. Immediately click the Save button and select Yes on the confirmation pop-up.",,"A continuous spinning wheel appears
 on the Save button",,,Platform: iOS,,,
78,"Network fluctuation: Updated 
status is not shown in hashmark. ",Round with meters,,,,,open,,,V4.2ao,,"Scenario 1:
1.Log in
2.Start Round
3.Mark 4 task status(Comp & next)
5.Click on save 
6.clear all mark status 
7.click on save
8.Immediately turn off wifi and turn on wifi 
9.give status(skip & next) to any task

Scenario 2:
1. Start round.
2. Mark 3 or more stops as complete and next.
3. click on save button and quickly fluctuate the network(OFF/ON).
4. Now quickly clear the marked status.",,"Scenario 1:
After network fluctuation, the new (Skip & Next) status is getting saved directly instead of showing Hashmark & Save.

Scenario 2:
The update stop status are not in hashmark.",,,"Platform: Android, ios",,,
79,White space is displayed instead of the records present in the list.,"In Maximo, delete the rounds 
that are displayed as the last records in the Atlas list. (I deleted 5 to 6 rounds)",,,,,open,,,v4.ao,,Refresh the round list.,,"White space is displayed instead of the records present in the list.
Workaround: when I scroll up the list then records displays",,,Platform: Android.,,,
80,Save button not appear for data in hashmark.(Sometimes),Round with meters,,,,,open,,,v4.2ao,,"1. Start round.
2. Add labor, click on the Save button and click Yes on the confirmation pop-up.
3. While background sync mark one task and immediately toggle the network Off/On.",,"Mark task and labor display in 
hashmark but no save button on top.",,,Platform: Android,,,
81,"continuous spinning wheel 
appears on save button",Round with 5-6 task,,,,,open,,,V4.2ao,,"1.Start round 
2.Mark 4 task as Comp & next
3.go to complete Tab
4.click on save 
5.while sync try to Network fluctuate.
6.then click on round complete
7.confirm popup 
8.click ok on Labor transaction window
9.start same round",,"continuous spinning wheel appears 
on save button",,,Platform: Android,,,
82,labor entry displays in hashmark and save button appears at the top.,2/3 round available in list.,,,,,,,,V4.2ao,,"1]. Start round.
2]. Click Back to list.
3]. Select and click start another round. | Labor windows appear.
4]. Click Ok from labor windows.
5]. While sync quickly turn Off and ON network.
6]. Close the start popup.
7]. Quickly Select and restart the same previously started round.
8]. Go to labor tab",,"labor entry displays in hashmark and
 save button appears at the top.",,,Platform: ios,,,
83,""" There is some data to be
 synced with the server. Do you want to continue?"" popup appears without save button on top.",Rounds in lis,,,,,resolved,,,V4.2ap,,"1. Click Start Round and then click the Calendar button.
2. Select a date and time earlier than the current date/time (e.g., 72 hours earlier).
3. Click OK.
4. Navigate to the Complete section.
5. Click complete round and click OK on the Labour popup.
6. ""Unable to save work"" Popup appears (as expected).
7. Click go back.
8. Navigate to Labor section || Add labor.
9. Delete the labour without saving.
10. Go back to list view.
11. Try starting another round.",,""" There is some data to be synced 
with the server. Do you want to continue?"" popup appears without save button on top.",,,Platform: iOS,,,
84,"Continue spinning is appears 
when I start deleted round in the list.","Minimum 1 round should
 available in the list.",,,,,,,,V4.2ap,,"1. Login to Atlas and navigate to round list. | Created round displays in the list.
2. Delete the round from Maximo.
3. Without list refresh select and start the same round which is deleted from Maximo.
",,Spinning is appears.,,,Platform: iOS,,,
85,"Partial Meter Sequence Order 
Mismatch",Round with partial sequence to meters in maxim,,,,,resolve,,,V4.2ap,,"1.Create a round.
2.Add multiple meters to the location and asset
3.Assign a partial sequence to the meters.
4.Log in to Atlas.
5.Start round
6.Click on stops.
7.check the meter list order.",,"In Atlas its displays sequence meters
 first and then non-sequence meters, instead of matching the Maximo meter order.",,,Platform: iOS,,,
86,"Continue spinning appears on 
Save button. ",Round with meters,,,,,resolve,,,V4.2ap,,"1. Add 3–4 labor entries:
      a).  Add 2 labor entries with a duration of        1 minute or 1 hour.
      b). Add 1 labor entry with a duration of 72 hours.
2. Click Save. | The Discard popup appears as expected.
3. Click Go Back or X to close the popup.
4. Update the labor entry with a 72-hour duration to 48 hours.
5. Click Save again. |The Discard popup appears as expected.
6. Click Go Back or X to close the popup.
7. Select and delete any one labor entry that was added with a 1-minute or 1-hour duration",,"1. Sync error popup with labor entry disappear for labor entry updated on step 4.
2. Save button appears, when click on save continue spinning is appears.",,,Platform: iOS,,,
87,"Continue spinning appears on 
Save button",Rounds with meters,,,,,,,,4.2aq,,"1. Start round.
2. Click Stop work from complete section.
3. On Labor windows, select start time over 48 hrs.
4. Click Ok,
5. While sync, turn off and on network quickly.
6. Restart the same round. 
7. Click On Save.",,Spinning appears on save.,,,Platform: iOS,,,`
