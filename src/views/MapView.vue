<template>
    <div class="pt-16">
        <h1 class="text-3xl font-semibold mb-4">Here's your trip</h1>
        <div>
            <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
                <div class="bg-white px-4 py-5 sm:p-6">
                    <div>
                        <GMapMap ref="gMap" :zoom="11" :center="location.destination.geometry"
                            style="width: 100%; height: 256px;">
                            <!-- <GMapMarker :position="location.destination.geometry"></GMapMarker> -->
                        </GMapMap>
                    </div>
                    <div class="mt-2">
                        <p class="text-xl">Going to <strong>{{ location.destination.name }}</strong></p>
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <button @click="handleConfirmTrip"
                        class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none">
                        Let's Go!</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useLocationStore } from '@/stores/location'
import { useTripStore } from '@/stores/trip'
import http from '@/helpers/http'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const location = useLocationStore()
const trip = useTripStore()
const router = useRouter()
const gMap = ref(null)
const handleConfirmTrip = () => {
    http().post('/api/trip',{
        origin: location.current.geometry,
        destination: location.destination.geometry,
        destination_name: location.destination.name,
    }).then((res) => {
        trip.$patch(res.data)
        router.push({
            name:'trip'
        })
    }).catch((error) => {
        console.error(error);
    })
}

// function addMyButton(map) {
//     const controlUI = document.createElement("button");
//     controlUI.title = "Click to zoom the map";
//     const controlText = document.createElement("div");
//     controlText.innerHTML = `Center`;
//     controlUI.appendChild(controlText);

//     controlUI.addEventListener("click", () => {
//         map.setZoom(map.getZoom() + 1);
//     });

//     map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlUI); // eslint-disable-line no-undef
// }

onMounted(async () => {
    if (location.destination.name == '') {
        router.push({
            name: 'location'
        })
    }

    await location.updateCurrentLocation()

    //Ve tuyen duong tren map
    gMap.value.$mapPromise.then((mapObject) => {

        let currentPoint = new google.maps.LatLng(location.current.geometry),
            destinationPoint = new google.maps.LatLng(location.destination.geometry),
            directionsService = new google.maps.DirectionsService,
            directionsDisplay = new google.maps.DirectionsRenderer({
                map: mapObject
            })

        directionsService.route({
            origin: currentPoint,
            destination: destinationPoint,
            avoidTolls: false,
            avoidHighways: false,
            travelMode: google.maps.TravelMode.DRIVING
        }, (res, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(res)
            } else {
                console.error(status)
            }
        })
    })
})
</script>