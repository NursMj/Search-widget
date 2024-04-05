<script>
	import SearchWidget from './CustomElements/SearchWidget.svelte';

	let myCities = ['Bishkek', 'Tokmok', 'Osh'];
  let elem

  $: console.log('elem :>> ', elem);

  setTimeout(() => {
    elem.cities = ['naryn', 'batkenn', 'tup']
    console.log(elem.cities);
  }, 2000)

	const handleSearch = (e) => {
		alert('search')
		console.log('e :>> ', e);
	};

  
	document.addEventListener('search', handleSearch);

</script>

<main>
	<h1>search-widget</h1>
	<search-widget bind:this={elem} cities={myCities} />
</main>

<style>
</style>
