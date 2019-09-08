var thisHTML = `
    <td style="border-bottom:1px solid #e3e3e3; width:260px" valign="top">
    	<h4 style="margin:0;padding:0;"></h4><br />
  	    <b>AA LITERATURE - AA Literature</b><br />
		122 East 37th Street, Basement, 
		<br />(Betw Park & Lexington Avenues) NY 10016
		<br />
		<br />
        
        <div class="detailsBox"> 
        	FRONT BASEMENT ONLY 
        </div>
    </td>
    `;


var strings = thisHTML.split('<br />');

for (var i = 0; i<strings.length; i++) {
    if(i === 2) {
        console.log(strings[i]);
    }
    else if(i === 3) {
        console.log(strings[i]);
    }
    else if(i === 4) {
        console.log(strings[i]);
    }
}                    