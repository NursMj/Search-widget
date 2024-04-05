<script>
	import SearchWidget from './CustomElements/SearchWidget.svelte';

	let myCities = ['Bishkek', 'Tokmok', 'Osh'];
	let otherCities = ['Moscow', 'London', 'Dubai'];
	let cities = myCities;

	const handleSearch = (e) => {
		alert('search event from search-widget, data is in console')
		console.log('data :>> ', e.detail);
	};

	const changeCities = () => {
    if (cities.includes('Bishkek')) {
      cities = otherCities
    } else {
      cities = myCities
    }
	};

</script>

<main>
  <button on:click={changeCities}>Сменить города (кнопка для теста, не красивая)</button>
	<h1>search-widget</h1>
	<search-widget on:search={handleSearch} {cities} />
</main>

<style>
</style>
