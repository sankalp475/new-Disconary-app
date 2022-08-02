const input = document.querySelector('input[type="text"]');
const FIND = document.querySelector('button[data-search="word-result"]')
const select = document.querySelector('.select')
const text_display = document.querySelector('.text > h1')
const resultContainer = document.querySelector('.search-word-result')
const sh = document.querySelector('.search-history')
let lang, word;
select.addEventListener('change', (event) => {
	lang = event.target.value;
})
document.querySelector('.git').addEventListener('click', () => {
	// window.location.href.replace('https://github.com/sankalp475/Dictionary_App')
	console.log(window.location.href = ('https://github.com/sankalp475/Dictionary_App'))
})
input.addEventListener('input', (event) => {
	word = event.target.value;
	text_display.innerHTML = 'Loding...'
	text_display.classList.add('has-text-animation');
})
// let btn = JSON.parse(localStorage.getItem('[search-history]'))
// sh.append(btn[0])

function appendHtml(w) {
	let btn = document.createElement('button')
	btn.classList = 'button is-link is-light mx-2'
	btn.innerHTML = w;
	btn.addEventListener('click', () => {
		input.value = btn.innerHTML;
		word = btn.innerHTML;
	})
	return btn;
}

const textArr = []
function wf(_word_) {
	textArr.push(_word_);
	console.log(textArr)
	localStorage.setItem('sh', JSON.stringify(textArr))
}

let history_Btn = (_innerText_) => `<button class="button is-link is-light mx-2">${_innerText_}</button>`
let wordObj = JSON.parse(localStorage.getItem('sh'));

wordObj.map((el) => {
	sh.insertAdjacentHTML('afterbegin',history_Btn(el))
})

FIND.addEventListener('click', (event) => {

	if (word === ' ' || word === undefined || word === null) {
		return;
	}
	if (lang === undefined) {
		lang = 'en';
	}
	const url = `https://api.dictionaryapi.dev/api/v2/entries/${lang}/${word}`
	getResutentData(url)

	wf(word)
	sh.insertAdjacentHTML('afterbegin',history_Btn(word))

})
const icon = {
	fullVolIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
		d="M8.889 16H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.332a.5.5 0 0 1 .817.387v15.89a.5.5 0 0 1-.817.387L8.89 16zm9.974.591l-1.422-1.422A3.993 3.993 0 0 0 19 12c0-1.43-.75-2.685-1.88-3.392l1.439-1.439A5.991 5.991 0 0 1 21 12c0 1.842-.83 3.49-2.137 4.591z" />
</svg>`,
	lowVolumeIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
	<path fill="none" d="M0 0h24v24H0z" />
	<path
		d="M5.889 16H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.332a.5.5 0 0 1 .817.387v15.89a.5.5 0 0 1-.817.387L5.89 16zm13.517 4.134l-1.416-1.416A8.978 8.978 0 0 0 21 12a8.982 8.982 0 0 0-3.304-6.968l1.42-1.42A10.976 10.976 0 0 1 23 12c0 3.223-1.386 6.122-3.594 8.134zm-3.543-3.543l-1.422-1.422A3.993 3.993 0 0 0 16 12c0-1.43-.75-2.685-1.88-3.392l1.439-1.439A5.991 5.991 0 0 1 18 12c0 1.842-.83 3.49-2.137 4.591z" />
</svg> `
}
localStorage.setItem('--fullvolumeicon--', JSON.stringify(icon));

vi = JSON.parse(localStorage.getItem('--fullvolumeicon--'))
async function getResutentData(url) {
	let res = await fetch(url);
	let data = await res.json()
	text_display.style.display = 'none';
	data.forEach((element) => {
		const r = mapResult(element);
		let renderContent = `
		    ${r.dataElement}
		`
		resultContainer.innerHTML = renderContent;
	})
}
window.AudioPlay = () => {
	document.querySelector('audio').play()
}

const returnElement = {
	phonetics: (rElement) => {
		let text, _audio_ = [];
		rElement.phonetics.forEach((r) => {
			text = r.text;
			_audio_.push(r.audio)
		})
		return { text, audio_link: _audio_.filter(e => e)[0] }
	}
}
function mapResult(mapArray) {



	let audioElm = returnElement.phonetics(mapArray)
	// console.log(s)
	const audio_word_block = `
		<div class="audio is-flex is-align-items-center">
			<button class="button is-shadowless is-flex" onClick="AudioPlay()">
			   ${vi.lowVolumeIcon}
			</button>
			<audio>
				<source src="${audioElm.audio_link}" data-target="audio_source" type="audio/mpeg">
			</audio>
			<div class="is-flex is-flex-direction-column">
				<h1 class="px-3 is-size-3 is-capitalized has-text-weight-semibold"> ${mapArray.word} </h1>
				<h1 class="px-3 is-size-6 is-capitalized has-text-weight-light">
					${audioElm.text}
				</h1>
			</div>
		</div>
	`
	const def = `<div class="definatioin">
		<div class="box is-shadowless">
		    ${mepDefArray(mapArray)}

            <aside class="menu">
				<ul class="menu-list">
					<a class="is-size-6  has-text-weight-semibold">example</a>
					${example(mapArray.meanings)}
			    </ul>
			</aside>
		</div>
	</div>`;
	function mepDefArray(element) {

		function meaning_array(element) {
			return element.map((result, i) => {
				return `
					<ul class="menu-list">
						<li >
						    <p class="is-size-6 p-2 ml-6 has-text-weight-semibold has-text-danger">${i + 1}> ${result.definition}</p>
						</li>
					</ul>
				`;
			}).join('')
		}
		let definition = element.meanings.map((arrElement) => {
			return `<aside class="menu">
				<ul class="menu-list">
					<a class="is-size-6  has-text-weight-semibold">${arrElement.partOfSpeech}</a>
				    ${meaning_array(arrElement.definitions)}
				</ul>
			</aside>`
		}).join('')
		return definition;
	}
	function example(element) {
		function example_map(element, partOfSpeech) {
			let ex;
			if (partOfSpeech == 'adjective' || partOfSpeech == 'interjection') {
				ex = element.map((result, i) => {
					return `<li>
						<p class="is-size-6 p-2 ml-6 has-text-weight-semibold has-text-danger">${i + 1}> ${result.example}</p>
					</li>`;
				}).join('')
			} else { return '' }
			return ex;
		}
		return element.map((result) => {
			return `${example_map(result.definitions, result.partOfSpeech)}`;
		}).join('')
	}
	let dataElement = `
	    <div className="data">
		    ${audio_word_block}
			${def}
		</div>
	`

	return { dataElement }
}