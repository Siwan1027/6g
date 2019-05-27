var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
mapOption = { 
center: new daum.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
level: 3 // 지도의 확대 레벨
};

var map = new daum.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
// 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
var mapTypeControl = new daum.maps.MapTypeControl();

// 지도 타입 컨트롤을 지도에 표시합니다
map.addControl(mapTypeControl, daum.maps.ControlPosition.TOPRIGHT);
var zoomControl = new daum.maps.ZoomControl();
map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);

function panTo(x, y) {
    var moveLatLon = new daum.maps.LatLng(x, y);
	var markerPosition  = new daum.maps.LatLng(x, y);
    map.panTo(moveLatLon);
	var marker = new daum.maps.Marker({
    position: markerPosition
	});
	marker.setMap(map);
}