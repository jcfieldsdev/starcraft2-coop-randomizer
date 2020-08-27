/******************************************************************************
 * Starcraft II Co-op Randomizer                                              *
 *                                                                            *
 * Copyright (C) 2018 J.C. Fields (jcfields@jcfields.dev).                    *
 *                                                                            *
 * Permission is hereby granted, free of charge, to any person obtaining a    *
 * copy of this software and associated documentation files (the "Software"), *
 * to deal in the Software without restriction, including without limitation  *
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,   *
 * and/or sell copies of the Software, and to permit persons to whom the      *
 * Software is furnished to do so, subject to the following conditions:       *
 *                                                                            *
 * The above copyright notice and this permission notice shall be included in *
 * all copies or substantial portions of the Software.                        *
 *                                                                            *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR *
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,   *
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL    *
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER *
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING    *
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER        *
 * DEALINGS IN THE SOFTWARE.                                                  *
 ******************************************************************************/

"use strict";

/*
 * constants
 */

const NEUTRAL = "neutral";
const TERRAN = "terran";
const ZERG = "zerg";
const PROTOSS = "protoss";

const DEFAULT_OPTIONS = {
	allowRepeats: false,
	usePlaylist:  false,
	playSounds:   true,
	volume:       50
};

const lists = {
	commanders: new List("commanders", [
		new Item("Raynor", "raynor", TERRAN,
			["Renegade Commander", "Backwater Marshal",
			 "Rough Rider", "Rebel Raider"]),
		new Item("Kerrigan", "kerrigan", ZERG,
			["Queen of Blades", "Malevolent Matriarch",
			 "Folly of Man", "Desolate Queen"]),
		new Item("Artanis", "artanis", PROTOSS,
			["Hierarch of the Daelaam", "Valorous Inspirator",
			 "Nexus Legate", "Arkship Commandant"]),
		new Item("Swann", "swann", TERRAN,
			["Chief Engineer", "Heavy Weapons Specialist",
			 "Grease Monkey", "Payload Director"]),
		new Item("Zagara", "zagara", ZERG,
			["Swarm Broodmother", "Scourge Queen",
			 "Mother of Constructs", "Apex Predator"]),
		new Item("Vorazun", "vorazun", PROTOSS,
			["Matriarch of the Nerazim", "Spirit of Respite",
			 "Withering Siphon", "Keeper of Shadows"]),
		new Item("Karax", "karax", PROTOSS,
			["Khalai Phase-Smith", "Architect of War",
			 "Templar Apparent", "Solarite Celestial"]),
		new Item("Abathur", "abathur", ZERG,
			["Evolution Master", "Essence Hoarder",
			 "Tunneling Horror", "The Limitless"]),
		new Item("Alarak", "alarak", PROTOSS,
			["Tal’darim Highlord", "Artificer of Souls",
			 "Tyrant Ascendant", "Shadow of Death"]),
		new Item("Nova", "nova", TERRAN,
			["Dominion Ghost", "Soldier of Fortune",
			 "Tactical Dispatcher", "Infiltration Specialist"]),
		new Item("Stukov", "stukov", ZERG,
			["Infested Admiral", "Frightful Fleshwelder",
			 "Plague Warden", "Lord of the Horde"]),
		new Item("Fenix", "fenix", PROTOSS,
			["Purifier Executor", "Akhundelar",
			 "Network Administrator", "Unconquered Spirit"]),
		new Item("Dehaka", "dehaka", ZERG,
			["Primal Pack Leader", "Devouring One",
			 "Primal Contender", "Broodbrother"]),
		new Item("Han & Horner", "han", TERRAN,
			["Mercenary Leader and Dominion Admiral", "Chaotic Power Couple",
			 "Wing Commanders", "Galactic Gunrunners"]),
		new Item("Tychus", "tychus", TERRAN,
			["Legendary Outlaw", "Technical Recruiter",
			 "Lone Wolf", "Dutiful Dogwalker"]),
		new Item("Zeratul", "zeratul", PROTOSS,
			["Dark Prelate", "Anakh Su’n",
			 "Knowledge Seeker", "Herald of the Void"]),
		new Item("Stetmann", "stetmann", ZERG,
			["Hero Genius (Henius)", "Signal Savant",
			 "Best Buddy", "Oil Baron"]),
		new Item("Mengsk", "mengsk", TERRAN,
			["Emperor of the Dominion", "Toxic Tyrant",
			 "Principal Proletariat", "Merchant of Death"])
	]),
	maps: new List("maps", [
		new Item("Chain of Ascension", "chain"),
		new Item("Cradle of Death", "cradle"),
		new Item("Dead of Night", "dead"),
		new Item("Lock and Load", "lock"),
		new Item("Malwarfare", "mwf"),
		new Item("Miner Evacuation", "miner"),
		new Item("Mist Opportunities", "mist"),
		new Item("Oblivion Express", "oblivion"),
		new Item("Part and Parcel", "partparcel"),
		new Item("Rifts to Korhal", "rifts"),
		new Item("Scythe of Amon", "scythe"),
		new Item("Temple of the Past", "temple"),
		new Item("The Vermillion Problem", "vermillion"),
		new Item("Void Launch", "voidlaunch"),
		new Item("Void Thrashing", "voidthrash")
	])
};

const options = new Options();

/*
 * initialization
 */

window.addEventListener("load", function() {
	const overlays = {
		maps:     new Overlay("map"),
		prestige: new Overlay("prestige"),
		list:     new Overlay("list"),
		options:  new Overlay("options")
	};
	const store = new Storage("coop", [lists.commanders, lists.maps, options]);
	const sound = new Sound();

	lists.commanders.print();
	lists.maps.print();
	options.set();
	store.load();

	lists.commanders.playlist.print();
	lists.maps.playlist.print();

	// counts open overlays
	let visible = 0;

	// keyboard events
	window.addEventListener("keyup", function(event) {
		const keyCode = event.keyCode;

		if (keyCode == 27) { // Esc
			if (visible) {
				closeAllOverlays();
			} else {
				for (const list of Object.values(lists)) {
					list.reset();
				}
			}
		}

		if (keyCode == 32) { // space bar
			randomize();
		}

		if (keyCode == 68) { // D
			options.reset();
		}

		if (keyCode == 70) { // F
			const [changeText, playSound] = lists.commanders.aStrongHeart();

			if (changeText) {
				$("#commander").textContent = "Talandar";
			}

			if (playSound) {
				sound.play("talandar");
			}

			lists.commanders.playlist.reload();
		}

		if (keyCode == 71) { // G
			visible += overlays.prestige.toggle();
		}

		if (keyCode == 76) { // L
			visible += overlays.list.toggle();
		}

		if (keyCode == 77) { // M
			visible += overlays.maps.toggle();
		}

		if (keyCode == 79) { // O
			visible += overlays.options.toggle();
		}

		if (keyCode == 80) { // P
			lists.commanders.filter(PROTOSS);
		}

		if (keyCode == 81) { // Q
			options.togglePlaylist();
		}

		if (keyCode == 82) { // R
			options.toggleRepeats();
		}

		if (keyCode == 83) { // S
			options.toggleSounds();
		}

		if (keyCode == 84) { // T
			lists.commanders.filter(TERRAN);
		}

		if (keyCode == 90) { // Z
			lists.commanders.filter(ZERG);
		}
	});
	window.addEventListener("keydown", function(event) {
		const keyCode = event.keyCode;

		if (keyCode == 38) { // up arrow
			options.adjustVolume(true);
			closeAllOverlays();
			visible += overlays.options.show();
		}

		if (keyCode == 40) { // down arrow
			options.adjustVolume(false);
			closeAllOverlays();
			visible += overlays.options.show();
		}
	});
	window.addEventListener("beforeunload", function() {
		store.save();
	});

	document.addEventListener("click", function(event) {
		const element = event.target;

		if (element.closest("main")) {
			closeAllOverlays();
		}

		if (element.closest("#randomize")) {
			randomize();
		}

		if (element.closest("#prestigeReset")) {
			for (const item of lists.commanders.list) {
				item.prestige.reset();
			}
		}

		if (element.closest("#listReset")) {
			for (const list of Object.values(lists)) {
				list.playlist.reset();
				list.playlist.reload();
			}
		}

		if (element.closest("#optionsReset")) {
			options.reset();
		}

		if (element.matches("#allowRepeats")) {
			options.toggleRepeats();
		}

		if (element.matches("#usePlaylist")) {
			options.togglePlaylist();
		}

		if (element.matches("#playSounds")) {
			options.toggleSounds();
		}

		if (element.closest(".item")) {
			const item = element.closest(".item");
			const list = element.closest(".list");

			lists[list.id].toggle(item.id);
		}

		if (element.matches(".prestige")) {
			const [id, prestige] = element.value.split(",");

			for (const item of lists.commanders.list) {
				if (item.id == id) {
					item.prestige.toggle(Number(prestige));
				}
			}
		}

		if (element.closest(".race")) {
			lists.commanders.filter(element.closest(".race").value);
		}

		if (element.closest(".reset")) {
			const list = element.closest(".reset").value;
			lists[list].reset();
		}

		if (element.closest(".open")) {
			const overlay = element.closest(".open").value;
			closeAllOverlays();
			visible += overlays[overlay].show();
		}

		if (element.closest(".close")) {
			const overlay = element.closest(".close").value;
			visible += overlays[overlay].hide();
		}
	});
	document.addEventListener("input", function(event) {
		const element = event.target;

		if (element.matches("#volume")) {
			options.setVolume();
		}
	});

	function closeAllOverlays() {
		for (const overlay of Object.values(overlays)) {
			visible += overlay.hide();
		}
	}

	function randomize() {
		const commander = lists.commanders.randomize();

		if (commander == null) {
			return;
		}

		const p = document.createElement("p");
		p.id = "play";
		p.appendChild(document.createTextNode("Play as "));

		const commanderName = document.createElement("span");
		commanderName.id = "commander";
		commanderName.className = "name";
		commanderName.textContent = commander.name;
		p.appendChild(commanderName);

		// only randomizes map if one or more is unselected
		if (lists.maps.countSelected() < lists.maps.list.length) {
			const map = lists.maps.randomize();

			if (map != null) {
				p.appendChild(document.createTextNode(" on "));

				const mapName = document.createElement("span");
				mapName.className = "name";
				mapName.textContent = map.name;
				p.appendChild(mapName);
			}
		}

		p.appendChild(document.createTextNode("!"));
		$("#play").replaceWith(p);

		$("#sub").textContent = commander.prestige.randomize();

		lists.commanders.playlist.reload();
		lists.maps.playlist.reload();

		// plays lock-in sound
		const index = Math.floor(Math.random() * 5);
		sound.play(commander.id + index);
	}
});

function $(selector) {
	return document.querySelector(selector);
}

function $$(selector) {
	return Array.from(document.querySelectorAll(selector));
}

/*
 * List prototype
 */

function List(id, list) {
	this.id = id;
	this.list = list;

	this.playlist = new Playlist(this);
	this.current = null;
}

List.prototype.set = function(data) {
	for (const item of Object.values(this.list)) {
		if (item.id in data) {
			item.set(data[item.id] & 0b01);
			item.play(data[item.id] & 0b10);

			if (item.prestige != null) {
				const states = [];

				for (const i of item.prestige.states.keys()) {
					let state = Boolean(data[item.id] & (1 << i + 2));

					if (i == 0) { // inverts default talent (on by default)
						state = !state;
					}

					states.push(state);
				}

				item.prestige.set(states);
			}
		}
	}

	this.playlist.create();
	this.playlist.filter();
};

List.prototype.toggle = function(id) {
	for (const item of Object.values(this.list)) {
		if (item.id == id) {
			item.toggle();
			this.playlist.reload();
		}
	}
};

List.prototype.filter = function(type) {
	for (const item of Object.values(this.list)) {
		if (item.type == type) {
			item.toggle();
		}
	}
};

List.prototype.reset = function() {
	for (const item of Object.values(this.list)) {
		item.set(true);
	}
};

List.prototype.aStrongHeart = function() {
	for (const item of Object.values(this.list)) {
		if (item.name == "Fenix") {
			item.rename("Talandar");
			return [this.current == item, true];
		}
	}

	return [false, false];
};

List.prototype.print = function() {
	const element = $("#" + this.id);

	for (const item of Object.values(this.list)) {
		element.appendChild(item.get());

		if (item.prestige != null) {
			item.prestige.print();
		}
	}
};

List.prototype.randomize = function() {
	const selected = this.countSelected();

	if (selected == 0) {
		return null;
	}

	let rand = null;

	if (options.values.usePlaylist) {
		rand = this.playlist.next();
	} else {
		const index = Math.floor(Math.random() * this.list.length);
		rand = this.list[index];
	}

	// allows repeats if not enough items selected, regardless of preference,
	// to prevent infinite recursion
	const allowRepeats = options.values.allowRepeats || selected == 1;

	// rolls again if item is de-selected or same as previous
	if (!rand.state || (!allowRepeats && (rand == this.current))) {
		return this.randomize();
	}

	if (this.current != null) {
		this.current.highlight(false);
	}

	this.current = rand;
	this.current.highlight(true);
	this.current.play(true);

	return rand;
};

List.prototype.countSelected = function() {
	return this.list.reduce(function(count, item) {
		return count + Number(item.state);
	}, 0);
};

List.prototype.defaultValues = function() {
	const played = this.list.some(function(item) {
		return item.played;
	});
	const deselected = this.list.some(function(item) {
		return !item.state;
	});
	const prestige = Object.values(this.list).some(function(item) {
		if (item.prestige != null) {
			return !item.prestige.defaultValues();
		}

		return false;
	});

	return !played && !deselected && !prestige;
};

List.prototype.serialize = function() {
	return this.list.reduce(function(obj, item) {
		obj[item.id] = Number(item.state) | Number(item.played) << 1;

		if (item.prestige != null) {
			for (const [i, prestige] of item.prestige.states.entries()) {
				let state = prestige;

				if (i == 0) { // inverts default talent (on by default)
					state = !state;
				}

				obj[item.id] |= state << i + 2;
			}
		}

		return obj;
	}, {});
};

/*
 * Item prototype
 */

function Item(name, id, type=NEUTRAL, talents=[]) {
	this.id = id;
	this.name = name;
	this.type = type;

	this.prestige = talents.length > 0 ? new Prestige(id, name, talents) : null;

	this.state = true;
	this.played = false;
}

Item.prototype.get = function() {
	const li = document.createElement("li");
	const a = document.createElement("a");
	const span = document.createElement("span");

	li.appendChild(a);
	a.id = this.id;
	a.className = "item";
	a.title = this.name;
	a.appendChild(span);
	span.textContent = this.name;

	if (this.type != NEUTRAL) {
		a.classList.add(this.type);
	}

	return li;
};

Item.prototype.set = function(state) {
	state = Boolean(state);
	this.state = state;

	const element = $("#" + this.id);

	if (element != null) {
		element.classList.toggle("disabled", !state);
	}
};

Item.prototype.toggle = function() {
	this.set(!this.state);
};

Item.prototype.highlight = function(state) {
	const element = $("#" + this.id);

	if (element != null) {
		element.classList.toggle("active", state);
	}
};

Item.prototype.play = function(played) {
	played = Boolean(played);
	this.played = played;

	const element = $("#" + this.id);

	if (element != null) {
		element.classList.toggle("played", played);
	}
};

Item.prototype.rename = function(name) {
	this.name = name;

	const element = $("#" + this.id);

	if (element != null) {
		element.title = name;
	}

	if (this.prestige != null) {
		this.prestige.rename(name);
	}
};

/*
 * Playlist prototype
 */

function Playlist(list) {
	this.list = list;
	this.queue = [];
}

Playlist.prototype.create = function() {
	const queue = this.list.list.slice(); // copies array
	let currentIndex = queue.length;

	while (currentIndex > 0) { // Fisher-Yates shuffle
		const randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		const temp = queue[currentIndex];
		queue[currentIndex] = queue[randomIndex];
		queue[randomIndex] = temp;
	}

	this.queue = queue;
};

Playlist.prototype.filter = function() {
	this.queue.filter(function(item) {
		return !item.played;
	});
};

Playlist.prototype.next = function() {
	if (this.queue.length == 0) {
		this.reset();
	}

	const next = this.queue.pop();

	// checks played state so item is skipped even if played when playlist
	// option was off
	return next.played ? this.next() : next;
};

Playlist.prototype.print = function() {
	const ul = $(`#${this.list.id}List`);

	for (const item of this.list.list) {
		const li = document.createElement("li");
		li.appendChild(document.createTextNode(item.name));
		ul.appendChild(li);
	}

	this.reload();
};

Playlist.prototype.reload = function() {
	for (const [i, element] of $$(`#${this.list.id}List li`).entries()) {
		const item = this.list.list[i];
		element.classList.toggle("disabled", !item.state || item.played);

		if (item.name != element.textContent) {
			element.textContent = item.name;
		}
	}
};

Playlist.prototype.reset = function() {
	this.create();

	for (const item of this.list.list) {
		item.play(false);
	}
};

/*
 * Prestige prototype
 */

function Prestige(id, name, list) {
	this.id = id;
	this.name = name;
	this.list = list;

	this.element = null;

	this.states = Array(list.length).fill(false);
	this.elements = Array(list.length).fill(null);
}

Prestige.prototype.print = function() {
	if (this.list.length == 0) {
		return;
	}

	const div = document.createElement("div");
	div.className = "prestiges";

	const name = document.createElement("div");
	name.textContent = this.name;
	div.appendChild(name);

	this.element = name;

	const ul = document.createElement("ul");

	for (const [i, name] of this.list.entries()) {
		const li = document.createElement("li");

		const button = document.createElement("button");
		button.className = "prestige";
		button.value = this.id + "," + i;
		button.textContent = name;
		button.title = name;
		button.setAttribute("type", "button");

		const state = i == 0;
		button.classList.toggle("disabled", !state);
		this.states[i] = state;
		this.elements[i] = button;

		li.appendChild(button);
		ul.appendChild(li);
	}

	div.appendChild(ul);
	$("#prestiges").appendChild(div);
};

Prestige.prototype.set = function(states) {
	this.states = states;
	this.reload();
};

Prestige.prototype.toggle = function(index) {
	this.states[index] = !this.states[index];
	this.elements[index].classList.toggle("disabled", !this.states[index]);
};

Prestige.prototype.reset = function() {
	this.states = this.states.map(function(undefined, i) {
		return i == 0;
	});
	this.reload();
};

Prestige.prototype.randomize = function() {
	const selected = this.states.some(function(state) {
		return state;
	});

	// returns empty string if defaults or no prestige selected
	if (this.defaultValues() || !selected) {
		return "";
	}

	const index = Math.floor(Math.random() * this.list.length);

	if (this.states[index]) {
		return this.list[index];
	}

	return this.randomize();
};

Prestige.prototype.reload = function() {
	for (const [i, element] of this.elements.entries()) {
		element.classList.toggle("disabled", !this.states[i]);
	}
};

Prestige.prototype.rename = function(name) {
	this.element.textContent = name;
};

Prestige.prototype.defaultValues = function() {
	return !this.states.some(function(state, i) {
		return i == 0 ? !state : state;
	});
};

/*
 * Overlay prototype
 */

function Overlay(name) {
	this.button = `${name}Button div`;
	this.overlay = `${name}Overlay`;
	this.visible = false;
}

Overlay.prototype.show = function() {
	if (this.visible) {
		return 0;
	}

	$("#" + this.button).hidden = true;
	$("#" + this.overlay).hidden = false;
	this.visible = true;

	return 1;
};

Overlay.prototype.hide = function() {
	if (!this.visible) {
		return 0;
	}

	$("#" + this.button).hidden = false;
	$("#" + this.overlay).hidden = true;
	this.visible = false;

	return -1;
};

Overlay.prototype.toggle = function() {
	if (this.visible) {
		return this.hide();
	}

	return this.show();
};

/*
 * Options prototype
 */

function Options(id) {
	this.id = "options";
	this.values = {};
	this.defaults = DEFAULT_OPTIONS;
}

Options.prototype.set = function(data=null) {
	if (data != null) {
		for (const key of Object.keys(this.defaults)) {
			if (key in data) {
				this.values[key] = data[key];
			}
		}
	}

	// sets values to defaults if not set
	if (Object.keys(this.values).length == 0) {
		return this.reset();
	}

	for (const [key, value] of Object.entries(this.values)) {
		const element = $("#" + key);

		if (element == null) {
			continue;
		}

		if (typeof value == "boolean") {
			element.checked = value;
			element.parentElement.classList.toggle("disabled", !value);
		} else {
			element.value = value;
		}
	}

	for (const list of Object.values(lists)) {
		const element = $("#" + list.id);

		element.classList.toggle("repeats", this.values.allowRepeats);
		element.classList.toggle("playlist", this.values.usePlaylist);
	}

	$("#listButton").hidden = !this.values.usePlaylist;
};

Options.prototype.reset = function() {
	this.set(this.defaults);
};

Options.prototype.toggleRepeats = function() {
	this.values.allowRepeats = !this.values.allowRepeats;

	if (this.values.allowRepeats) {
		this.values.usePlaylist = false;
	}

	this.set();
};

Options.prototype.togglePlaylist = function() {
	this.values.usePlaylist = !this.values.usePlaylist;

	if (this.values.usePlaylist) {
		this.values.allowRepeats = false;
	}

	this.set();
};

Options.prototype.toggleSounds = function() {
	this.values.playSounds = !this.values.playSounds;
	this.set();
};

Options.prototype.setVolume = function() {
	this.values.volume = Number($("#volume").value);
	this.set();
};

Options.prototype.adjustVolume = function(direction) {
	if (direction) {
		this.values.volume += 10;
		this.values.volume = Math.min(this.values.volume, 100);
	} else {
		this.values.volume -= 10;
		this.values.volume = Math.max(this.values.volume, 0);
	}

	this.set();
};

Options.prototype.defaultValues = function() {
	return !Object.keys(this.defaults).some(function(key) {
		return this.values[key] != this.defaults[key];
	}.bind(this));
};

Options.prototype.serialize = function() {
	return this.values;
};

/*
 * Sound prototype
 */

function Sound() {
	this.list = [new Audio(), new Audio(), new Audio(), new Audio()];
	this.current = 0;

	// fallback to AAC if Ogg Vorbis is not supported (specifically for Safari)
	this.format = this.list[0].canPlayType("audio/ogg") != "" ? "ogg" : "m4a";
}

Sound.prototype.play = function(file) {
	if (!options.values.playSounds || options.values.volume == 0) {
		return;
	}

	// cycles through sound channels
	const previous = this.current;
	const current = this.current != this.list.length - 1 ? this.current + 1 : 0;
	this.current = current;

	const audio = this.list[current];
	audio.src = `sounds/${this.format}/${file}.${this.format}`;
	audio.volume = this.getVolume();
	audio.play();

	this.fade(previous);
};

Sound.prototype.fade = function(channel) {
	const audio = this.list[channel];

	if (audio.volume) {
		let volume = this.getVolume();
		const timer = window.setInterval(function() {
			volume -= 0.05;
			audio.volume = Math.min(Math.max(volume.toFixed(2), 0), 1);

			if (audio.volume <= 0 || this.current == channel) {
				window.clearInterval(timer);
			}
		}.bind(this), 100);
	}
};

Sound.prototype.getVolume = function() {
	return options.values.volume / 100;
};

/*
 * Storage prototype
 */

function Storage(name, lists) {
	this.name = name;
	this.lists = lists;
}

Storage.prototype.load = function() {
	try {
		const data = JSON.parse(localStorage.getItem(this.name));

		if (data != null) {
			for (const list of Object.values(this.lists)) {
				if (list.id in data) {
					list.set(data[list.id]);
				}
			}
		}
	} catch (err) {
		console.error(err);
		this.reset();
	}
};

Storage.prototype.save = function() {
	try {
		const data = this.lists.reduce(function(obj, list) {
			if (!list.defaultValues()) {
				obj[list.id] = list.serialize();
			}

			return obj;
		}, {});

		if (Object.keys(data).length == 0) {
			// clears local storage if all items are set to default values
			localStorage.removeItem(this.name);
		} else {
			localStorage.setItem(this.name, JSON.stringify(data));
		}
	} catch (err) {
		console.error(err);
	}
};

Storage.prototype.reset = function() {
	try {
		localStorage.removeItem(this.name);
	} catch (err) {
		console.error(err);
	}
};