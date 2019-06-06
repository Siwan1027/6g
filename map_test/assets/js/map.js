var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
mapOption = { 
	center: new daum.maps.LatLng(36.815105, 127.113886), // 지도의 중심좌표
	level: 3 // 지도의 확대 레벨
	};

var map = new daum.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
// 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
var mapTypeControl = new daum.maps.MapTypeControl();

var ps = new daum.maps.services.Places(map); 

var category = new Array("MT1", "CS2", "PS3", "SC4", "SW8", "PO3", "FD6", "PM9"); //카테고리 코드
var categoryCount = 0; // 카테고리 카운트
var mart, conv, kids, school, station, public, rest, bus, pharm;
var hospital = [];
var hosCount = 0;
var markers = [];

// 지도 타입 컨트롤을 지도에 표시합니다
map.addControl(mapTypeControl, daum.maps.ControlPosition.TOPRIGHT);
var zoomControl = new daum.maps.ZoomControl();
map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);

var marker = new daum.maps.Marker({ 
    // 지도 중심좌표에 마커를 생성합니다 
    position: map.getCenter() 
});
// 지도에 마커를 표시합니다
marker.setMap(map);
markers.push(marker);

// 지도에 클릭 이벤트를 등록합니다
// 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
daum.maps.event.addListener(map, 'click', function(mouseEvent) {        
    
    // 클릭한 위도, 경도 정보를 가져옵니다 
    var latlng = mouseEvent.latLng; 
    
    // 마커 위치를 클릭한 위치로 옮깁니다
    marker.setPosition(latlng);
    
    action(latlng.getLat(), latlng.getLng());
});

if (navigator.geolocation) {
    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    navigator.geolocation.getCurrentPosition(function(position) {
        
        var lat = position.coords.latitude, // 위도
            lon = position.coords.longitude; // 경도
        
			var moveLatLon = new daum.maps.LatLng(lat, lon);
			var markerPosition  = new daum.maps.LatLng(lat, lon);
			map.panTo(moveLatLon);
			var marker = new daum.maps.Marker({
			position: markerPosition
			});
			removeMarker();
			marker.setMap(map);
			markers.push(marker);
      });
    
}

function action(x, y) {
	mart = conv = kids = school = station = public = rest = pharm = undefined;
	removeMarker();
	var detail = document.getElementById("detailView");
	if (detail == null) {
		alert("detailView" + ' 찾기 오류'); 
		return;
	 }
	detail.innerHTML = "";
	map.setLevel(3);
	var moveLatLon = new daum.maps.LatLng(x, y);
	var markerPosition  = new daum.maps.LatLng(x, y);
    map.panTo(moveLatLon);
	var marker = new daum.maps.Marker({
    position: markerPosition
	});
	marker.setMap(map);
	markers.push(marker);
	getBus(x, y);
	getHospital(x, y);
	placeSearch();
}

function placeSearch(){
	ps.categorySearch(category[categoryCount], placesSearchCB, {useMapBounds:true});
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
    if (status === daum.maps.services.Status.OK) {
		if(categoryCount < category.length){
			if(categoryCount === 0){
				mart = data;
				setHtml(category[categoryCount], data.length + "개 <a href=\"javascript:void(0);\" onclick=\"detailView(\'mart\');\">상세보기</a>");
			}
			else if(categoryCount === 1){
				conv = data;
				setHtml(category[categoryCount], data.length + "개 <a href=\"javascript:void(0);\" onclick=\"detailView(\'conv\');\">상세보기</a>");
			}
			else if(categoryCount === 2){
				kids = data;
				setHtml(category[categoryCount], data.length + "개 <a href=\"javascript:void(0);\" onclick=\"detailView(\'kids\');\">상세보기</a>");
			}
			else if(categoryCount === 3){
				school = data;
				setHtml(category[categoryCount], data.length + "개 <a href=\"javascript:void(0);\" onclick=\"detailView(\'school\');\">상세보기</a>");
			}
			else if(categoryCount === 4){
				station = data;
				setHtml(category[categoryCount], data.length + "개 <a href=\"javascript:void(0);\" onclick=\"detailView(\'station\');\">상세보기</a>");
			}
			else if(categoryCount === 5){
				public = data;
				setHtml(category[categoryCount], data.length + "개 <a href=\"javascript:void(0);\" onclick=\"detailView(\'public\');\">상세보기</a>");
			}
			else if(categoryCount === 6){
				rest = data;
				setHtml(category[categoryCount], data.length + "개 <a href=\"javascript:void(0);\" onclick=\"detailView(\'rest\');\">상세보기</a>");
			}
			else if(categoryCount === 7){
				pharm = data;
				setHtml(category[categoryCount], data.length + "개 <a href=\"javascript:void(0);\" onclick=\"detailView(\'pha\');\">상세보기</a>");
			}
			categoryCount++;
			if(categoryCount === category.length){
				categoryCount = 0;
				return;
			}
			else{
				placeSearch();
			}
			}
		} else if (status === daum.maps.services.Status.ZERO_RESULT) {
			if(categoryCount < category.length){
				setHtml(category[categoryCount], "검색결과 없음");
				categoryCount++;
				if(categoryCount === category.length){
					categoryCount = 0;
					return;
				}
				else{
					placeSearch();
				}
				}
    } else if (status === daum.maps.services.Status.ERROR) {
        alert("오류");
    }
}

function setHtml(item_id, item_html)
{
	 obj = document.getElementById(item_id);
	 if (obj == null) {
		 alert(item_id + ' 찾기 오류');
		 return;
	 }
	 obj.innerHTML = item_html;
} // html 내용바꾸기

function removeMarker() {
    for ( var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
    }   
    markers = [];
}

function detailView(cname){
	var detail = document.getElementById("detailView");
	if (detail == null) {
		alert("detailView" + ' 찾기 오류'); 
		return;
	 }
	detail.innerHTML = "";

	if(cname === "mart"){
		for(var i=0; i<mart.length; i++){
			newTR = document.createElement('tr');
			detail.appendChild(newTR);
			newTR.innerHTML = "<th scope=\'row\' onClick=geoMarkerAdd(" + mart[i].y + "," + mart[i].x + "); style=\"cursor:pointer;\">" + mart[i].place_name + "</th>" + "<td onClick=\"window.open(\'" + mart[i].place_url + "\',\'\',\'\');\" style=\"cursor:pointer;\">" + mart[i].road_address_name + "</td> <td>" + mart[i].phone + "</td>";
		}
	}
	else if(cname === "conv"){
		for(var i=0; i<conv.length; i++){
			newTR = document.createElement('tr');
			detail.appendChild(newTR);
			newTR.innerHTML = "<th scope=\'row\' onClick=geoMarkerAdd(" + conv[i].y + "," + conv[i].x + "); style=\"cursor:pointer;\">" + conv[i].place_name + "</th>" + "<td onClick=\"window.open(\'" + conv[i].place_url + "\',\'\',\'\');\" style=\"cursor:pointer;\">" + conv[i].road_address_name + "</td> <td>" + conv[i].phone + "</td>";
		}
	}
	else if(cname === "kids"){
		for(var i=0; i<kids.length; i++){
			newTR = document.createElement('tr');
			detail.appendChild(newTR);
			newTR.innerHTML = "<th scope=\'row\' onClick=geoMarkerAdd(" + kids[i].y + "," + kids[i].x + "); style=\"cursor:pointer;\">" + kids[i].place_name + "</th>" + "<td onClick=\"window.open(\'" + kids[i].place_url + "\',\'\',\'\');\" style=\"cursor:pointer;\">" + kids[i].road_address_name + "</td> <td>" + kids[i].phone + "</td>";
		}
	}
	else if(cname === "school"){
		for(var i=0; i<school.length; i++){
			newTR = document.createElement('tr');
			detail.appendChild(newTR);
			newTR.innerHTML = "<th scope=\'row\' onClick=geoMarkerAdd(" + school[i].y + "," + school[i].x + "); style=\"cursor:pointer;\">" + school[i].place_name + "</th>" + "<td onClick=\"window.open(\'" + school[i].place_url + "\',\'\',\'\');\" style=\"cursor:pointer;\">" + school[i].road_address_name + "</td> <td>" + school[i].phone + "</td>";
		}
	}
	else if(cname === "station"){
		for(var i=0; i<station.length; i++){
			newTR = document.createElement('tr');
			detail.appendChild(newTR);
			newTR.innerHTML = "<th scope=\'row\' onClick=geoMarkerAdd(" + station[i].y + "," + station[i].x + "); style=\"cursor:pointer;\">" + station[i].place_name + "</th>" + "<td onClick=\"window.open(\'" + station[i].place_url + "\',\'\',\'\');\" style=\"cursor:pointer;\">" + station[i].road_address_name + "</td> <td>" + station[i].phone + "</td>";
		}
	}
	else if(cname === "public"){
		for(var i=0; i<public.length; i++){
			newTR = document.createElement('tr');
			detail.appendChild(newTR);
			newTR.innerHTML = "<th scope=\'row\' onClick=geoMarkerAdd(" + public[i].y + "," + public[i].x + "); style=\"cursor:pointer;\">" + public[i].place_name + "</th>" + "<td onClick=\"window.open(\'" + public[i].place_url + "\',\'\',\'\');\" style=\"cursor:pointer;\">" + public[i].road_address_name + "</td> <td>" + public[i].phone + "</td>";
		}
	}
	else if(cname === "rest"){
		for(var i=0; i<rest.length; i++){
			newTR = document.createElement('tr');
			detail.appendChild(newTR);
			newTR.innerHTML = "<th scope=\'row\' onClick=geoMarkerAdd(" + rest[i].y + "," + rest[i].x + "); style=\"cursor:pointer;\">" + rest[i].place_name + "</th>" + "<td onClick=\"window.open(\'" + rest[i].place_url + "\',\'\',\'\');\" style=\"cursor:pointer;\">" + rest[i].road_address_name + "</td> <td>" + rest[i].phone + "</td>";
		}
	}
	else if(cname === "bus"){
		for(var i=0; i<bus.response.body.items.item.length; i++){
			newTR = document.createElement('tr');
			detail.appendChild(newTR);
			newTR.innerHTML = "<th scope=\'row\' onClick=geoMarkerAdd(" + bus.response.body.items.item[i].gpslati + "," + bus.response.body.items.item[i].gpslong + "); style=\"cursor:pointer;\">" + bus.response.body.items.item[i].nodenm + " 정류장" + "</th>";
		}
	}
	else if(cname === "hos"){
		for(var i=0; i<hospital[0].response.body.totalCount; i++){
			newTR = document.createElement('tr');
			detail.appendChild(newTR);
			if(hospital[0].response.body.totalCount === 1){
				newTR.innerHTML = "<th scope=\'row\' onClick=geoMarkerAdd(" + hospital[0].response.body.items.item.YPos + "," + hospital[0].response.body.items.item.XPos + "); style=\"cursor:pointer;\">" + hospital[0].response.body.items.item.yadmNm + "</th>" + "<td>" + hospital[0].response.body.items.item.addr + "</td> <td>" + hospital[0].response.body.items.item.telno + "</td>";
			}
			else{
				newTR.innerHTML = "<th scope=\'row\' onClick=geoMarkerAdd(" + hospital[0].response.body.items.item[i].YPos + "," + hospital[0].response.body.items.item[i].XPos + "); style=\"cursor:pointer;\">" + hospital[0].response.body.items.item[i].yadmNm + "</th>" + "<td>" + hospital[0].response.body.items.item[i].addr + "</td> <td>" + hospital[0].response.body.items.item[i].telno + "</td>";

			}}
		for(var i=0; i<hospital[1].response.body.totalCount; i++){
			newTR = document.createElement('tr');
			detail.appendChild(newTR);
			if(hospital[1].response.body.totalCount === 1){
				newTR.innerHTML = "<th scope=\'row\' onClick=geoMarkerAdd(" + hospital[1].response.body.items.item.YPos + "," + hospital[1].response.body.items.item.XPos + "); style=\"cursor:pointer;\">" + hospital[1].response.body.items.item.yadmNm + "</th>" + "<td>" + hospital[1].response.body.items.item.addr + "</td> <td>" + hospital[1].response.body.items.item.telno + "</td>";
			}
			else{
				newTR.innerHTML = "<th scope=\'row\' onClick=geoMarkerAdd(" + hospital[1].response.body.items.item[i].YPos + "," + hospital[1].response.body.items.item[i].XPos + "); style=\"cursor:pointer;\">" + hospital[1].response.body.items.item[i].yadmNm + "</th>" + "<td>" + hospital[1].response.body.items.item[i].addr + "</td> <td>" + hospital[1].response.body.items.item[i].telno + "</td>";

			}}
		for(var i=0; i<hospital[2].response.body.totalCount; i++){
			newTR = document.createElement('tr');
			detail.appendChild(newTR);
			if(hospital[2].response.body.totalCount === 1){
				newTR.innerHTML = "<th scope=\'row\' onClick=geoMarkerAdd(" + hospital[2].response.body.items.item.YPos + "," + hospital[2].response.body.items.item.XPos + "); style=\"cursor:pointer;\">" + hospital[2].response.body.items.item.yadmNm + "</th>" + "<td>" + hospital[2].response.body.items.item.addr + "</td> <td>" + hospital[2].response.body.items.item.telno + "</td>";
			}
			else{
				newTR.innerHTML = "<th scope=\'row\' onClick=geoMarkerAdd(" + hospital[2].response.body.items.item[i].YPos + "," + hospital[2].response.body.items.item[i].XPos + "); style=\"cursor:pointer;\">" + hospital[2].response.body.items.item[i].yadmNm + "</th>" + "<td>" + hospital[2].response.body.items.item[i].addr + "</td> <td>" + hospital[2].response.body.items.item[i].telno + "</td>";

			}}
		for(var i=0; i<hospital[3].response.body.totalCount; i++){
			newTR = document.createElement('tr');
			detail.appendChild(newTR);
			if(hospital[3].response.body.totalCount === 1){
				newTR.innerHTML = "<th scope=\'row\' onClick=geoMarkerAdd(" + hospital[3].response.body.items.item.YPos + "," + hospital[3].response.body.items.item.XPos + "); style=\"cursor:pointer;\">" + hospital[3].response.body.items.item.yadmNm + "</th>" + "<td>" + hospital[3].response.body.items.item.addr + "</td> <td>" + hospital[3].response.body.items.item.telno + "</td>";
			}
			else{
				newTR.innerHTML = "<th scope=\'row\' onClick=geoMarkerAdd(" + hospital[3].response.body.items.item[i].YPos + "," + hospital[3].response.body.items.item[i].XPos + "); style=\"cursor:pointer;\">" + hospital[3].response.body.items.item[i].yadmNm + "</th>" + "<td>" + hospital[3].response.body.items.item[i].addr + "</td> <td>" + hospital[3].response.body.items.item[i].telno + "</td>";

			}}
	}
	else if(cname === "pha"){
		for(var i=0; i<pharm.length; i++){
			newTR = document.createElement('tr');
			detail.appendChild(newTR);
			newTR.innerHTML = "<th scope=\'row\' onClick=geoMarkerAdd(" + pharm[i].y + "," + pharm[i].x + "); style=\"cursor:pointer;\">" + pharm[i].place_name + "</th>" + "<td onClick=\"window.open(\'" + pharm[i].place_url + "\',\'\',\'\');\" style=\"cursor:pointer;\">" + pharm[i].road_address_name + "</td> <td>" + pharm[i].phone + "</td>";
		}
	}
} // 상세정보 보기 구현

function geoMarkerAdd(x, y){
	removeMarker();
	map.setLevel(1);
	var moveLatLon = new daum.maps.LatLng(x, y);
	var markerPosition  = new daum.maps.LatLng(x, y);
    map.panTo(moveLatLon);
	var marker = new daum.maps.Marker({
    position: markerPosition
	});
	marker.setMap(map);
	markers.push(marker);
	document.getElementById("map").scrollIntoView();
}

function getBus(x, y){
	var serviceUrl = "http://api.groovin.kr/?serviceKey=";
	var svcKey = "ossp";
	var gps = "&x=" + x + "&y=" + y;
	var url = serviceUrl + svcKey + gps + "&cat=bus";
	
	$.ajax({
		dataType : "json",
		url : url,
		success : function(data) {
			if(data.response.body.totalCount === 0){
				setHtml("BUS", "검색결과 없음");
			}
			else {
				setHtml("BUS", data.response.body.totalCount + "개 <a href=\"javascript:void(0);\" onclick=\"detailView(\'bus\');\">상세보기</a>");
			}
			bus = data;
		}
	});
}

function getHospital(x, y){
	var serviceUrl = "http://api.groovin.kr/?serviceKey=";
	var svcKey = "ossp";
	var gps = "&x=" + x + "&y=" + y;
	var url = serviceUrl + svcKey + gps + "&cat=hospital";
	hosCount = 0;
	
	$.ajax({
		dataType : "json",
		url : url + "&zipCd=2010",
		success : function(data) {
			hosCount += data.response.body.totalCount;
			hospital[0] = data;
		}
	});

	$.ajax({
		dataType : "json",
		url : url + "&zipCd=2030",
		success : function(data) {
			hosCount += data.response.body.totalCount;
			hospital[1] = data;
		}
	});

	$.ajax({
		dataType : "json",
		url : url + "&zipCd=2050",
		success : function(data) {
			hosCount += data.response.body.totalCount;
			hospital[2] = data;
		}
	});

	$.ajax({
		dataType : "json",
		url : url + "&zipCd=2070",
		success : function(data) {
			hosCount += data.response.body.totalCount;
			if(hosCount === 0){
				setHtml("HOS", "검색결과 없음");
			}
			else {
				setHtml("HOS", hosCount + "개 <a href=\"javascript:void(0);\" onclick=\"detailView(\'hos\');\">상세보기</a>");
			}
			hospital[3] = data;
			chart();
		}
	});
}

function chart(){
	
	var container = document.getElementById('chart');
	container.innerHTML = "";
	var dummy = [];

	if(mart === undefined){
		mart = dummy;
	}
	if(conv === undefined){
		conv = dummy;
	}
	if(kids === undefined){
		kids = dummy;
	}
	if(school === undefined){
		school = dummy;
	}
	if(station === undefined){
		station = dummy;
	}
	if(public === undefined){
		public = dummy;
	}
	if(rest === undefined){
		rest = dummy;
	}
	if(pharm === undefined){
		pharm = dummy;
	}

	var martScore, convScore, stationBusScore, publicScore, restScore, hosScore, pharmScore;
	var kidsScore = [];
	var schoolScore = [];

	if(mart.length >= 5){
		martScore = 5;
	}
	else if(mart.length === 4){
		martScore = 4;
	}
	else if(mart.length === 3){
		martScore = 3;
	}
	else if(mart.length === 2){
		martScore = 2;
	}
	else if(mart.length === 1){
		martScore = 1;
	}
	else if(mart.length === 0){
		martScore = 0;
	}

	if(conv.length >= 10){
		convScore = 5;
	}
	else if(conv.length >= 9){
		convScore = 4.5;
	}
	else if(conv.length >= 8){
		convScore = 4;
	}
	else if(conv.length >= 7){
		convScore = 3.5;
	}
	else if(conv.length >= 6){
		convScore = 3;
	}
	else if(conv.length >= 5){
		convScore = 2.5;
	}
	else if(conv.length >= 4){
		convScore = 2;
	}
	else if(conv.length >= 3){
		convScore = 1.5;
	}
	else if(conv.length >= 2){
		convScore = 1;
	}
	else if(conv.length >= 1){
		convScore = 0.5;
	}
	else if(conv.length === 0){
		convScore = 0;
	}

	if(station.length + bus.response.body.totalCount >= 20){
		stationBusScore = 5;
	}
	else if(station.length + bus.response.body.totalCount >= 17){
		stationBusScore = 4.5;
	}
	else if(station.length + bus.response.body.totalCount >= 15){
		stationBusScore = 4;
	}
	else if(station.length + bus.response.body.totalCount >= 12){
		stationBusScore = 3.5;
	}
	else if(station.length + bus.response.body.totalCount >= 9){
		stationBusScore = 3;
	}
	else if(station.length + bus.response.body.totalCount >= 7){
		stationBusScore = 2.5;
	}
	else if(station.length + bus.response.body.totalCount >= 5){
		stationBusScore = 2;
	}
	else if(station.length + bus.response.body.totalCount >= 3){
		stationBusScore = 1.5;
	}
	else if(station.length + bus.response.body.totalCount >= 1){
		stationBusScore = 1;
	}
	else if(station.length + bus.response.body.totalCount === 0){
		stationBusScore = 0;
	}

	if(public.length >= 2){
		publicScore = 5;
	}
	else if(public.length === 1){
		publicScore = 3;
	}
	else if(public.length === 0){
		publicScore = 0;
	}

	if(rest.length >= 15){
		restScore = 5
	}
	else if(rest.length >= 13){
		restScore = 4.5;
	}
	else if(rest.length >= 11){
		restScore = 4;
	}
	else if(rest.length >= 9){
		restScore = 3.5;
	}
	else if(rest.length >= 7){
		restScore = 3;
	}
	else if(rest.length >= 5){
		restScore = 2.5;
	}
	else if(rest.length >= 3){
		restScore = 2;
	}
	else if(rest.length >= 2){
		restScore = 1.5;
	}
	else if(rest.length === 1){
		restScore = 1;
	}
	else if(rest.length === 0){
		restScore = 0;
	}

	if(hosCount >= 20){
		hosScore = 5;
	}
	else if(hosCount >= 17){
		hosScore = 4.5;
	}
	else if(hosCount >= 15){
		hosScore = 4;
	}
	else if(hosCount >= 13){
		hosScore = 3.5;
	}
	else if(hosCount >= 11){
		hosScore = 3;
	}
	else if(hosCount >= 9){
		hosScore = 2.5;
	}
	else if(hosCount >= 7){
		hosScore = 2;
	}
	else if(hosCount >= 5){
		hosScore = 1.5;
	}
	else if(hosCount >= 3){
		hosScore = 1;
	}
	else if(hosCount === 1){
		hosScore = 0.5;
	}
	else if(hosCount === 0){
		hosScore = 0;
	}

	if(pharm.length >= 10){
		pharmScore = 5;
	}
	else if(pharm.length >= 9){
		pharmScore = 4.5;
	}
	else if(pharm.length >= 8){
		pharmScore = 3.5;
	}
	else if(pharm.length >= 7){
		pharmScore = 3;
	}
	else if(pharm.length >= 6){
		pharmScore = 2.5;
	}
	else if(pharm.length >= 5){
		pharmScore = 2;
	}
	else if(pharm.length >= 4){
		pharmScore = 1.5;
	}
	else if(pharm.length >= 3){
		pharmScore = 1;
	}
	else if(pharm.length >= 2){
		pharmScore = 1;
	}
	else if(pharm.length === 1){
		pharmScore = 0.5;
	}
	else if(pharm.length === 0){
		pharmScore = 0;
	}

	if(kids.length >= 15){
		kidsScore[0] = 1;
		kidsScore[1] = 5;
	}
	else if(kids.length >= 13){
		kidsScore[0] = 1.5;
		kidsScore[1] = 4.5;
	}
	else if(kids.length >= 11){
		kidsScore[0] = 2;
		kidsScore[1] = 4;
	}
	else if(kids.length >= 9){
		kidsScore[0] = 2.5;
		kidsScore[1] = 3.5;
	}
	else if(kids.length >= 7){
		kidsScore[0] = 3;
		kidsScore[1] = 3;
	}
	else if(kids.length >= 5){
		kidsScore[0] = 3.5;
		kidsScore[1] = 2.5;
	}
	else if(kids.length >= 3){
		kidsScore[0] = 4;
		kidsScore[1] = 2;
	}
	else if(kids.length >= 1){
		kidsScore[0] = 4.5;
		kidsScore[1] = 1;
	}
	else if(kids.length === 0){
		kidsScore[0] = 5;
		kidsScore[1] = 0;
	}

	if(school.length >= 3){
		schoolScore[0] = 1;
		schoolScore[1] = 5;
	}
	else if(school.length >= 2){
		schoolScore[0] = 3;
		schoolScore[1] = 3;
	}
	else if(school.length >= 1){
		schoolScore[0] = 4;
		schoolScore[1] = 1;
	}
	else if(school.length === 0){
		schoolScore[0] = 5;
		schoolScore[1] = 0;
	}
	
	var data = {
		categories: ['마트', '편의점', '어린이집 / 유치원', '학교', '지하철역 / 버스 정류장', '공공기관', '음식점', '병원', '약국'],
		series: [
			{
				name: '2~30대',
				data: [martScore,convScore,kidsScore[0],schoolScore[0],stationBusScore,publicScore,restScore,hosScore,pharmScore]
			},
			{
				name: '30대 이상',
				data: [martScore,convScore,kidsScore[1],schoolScore[1],stationBusScore,publicScore,restScore,hosScore,pharmScore]
			},
		]
	};
	var options = {
		categories: ['마트', '편의점', '어린이집 / 유치원', '학교', '지하철역', '공공기관', '음식점', '버스 정류장', '병원', '약국'],
		chart: {
			width: document.getElementById("chart").clientWidth,
			height: 650,
			title: '지역 편의성 점수',
			format: '1'
		},
		yAxis: {
			title: '점수',
			min: 0,
			max: 5
		},
		xAxis: {
			title: '항목'
		},
		legend: {
			align: 'top'
		},
	};
	var theme = {
		categories: {
			colors: [
				'#83b14e', '#458a3f', '#295ba0', '#2a4175', '#289399',
				'#289399', '#617178', '#8a9a9a', '#516f7d', '#dddddd'
			]
		}
	};
	// For apply theme
	//tui.chart.registerTheme('myTheme', theme);
	//options.theme = 'myTheme';
	tui.chart.columnChart(container, data, options);
}