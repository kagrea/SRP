"use strict";

class PageFilterTrapsHazards extends PageFilter {
	// region static
	static sortFilterType (a, b) {
		return SortUtil.ascSortLower(Parser.trapHazTypeToFull(a.item), Parser.trapHazTypeToFull(b.item));
	}
	// endregion

	constructor () {
		super();

		this._typeFilter = new Filter({
			header: "Type",
			items: [
				"MECH",
				"MAG",
				"SMPL",
				"CMPX",
				"HAZ",
				"WTH",
				"ENV",
				"WLD",
				"GEN",
			],
			displayFn: Parser.trapHazTypeToFull,
			itemSortFn: PageFilterTrapsHazards.sortFilterType.bind(PageFilterTrapsHazards),
		});
		this._miscFilter = new Filter({header: "Miscellaneous", items: ["SRD", "Basic Rules", "Has Images", "Has Info"], isMiscFilter: true});
	}

	static mutateForFilters (it) {
		it.trapHazType = it.trapHazType || "HAZ";

		it._fMisc = [];
		if (it.srd) it._fMisc.push("SRD");
		if (it.basicRules) it._fMisc.push("Basic Rules");
		if (it.hasFluff || it.fluff?.entries) it._fMisc.push("Has Info");
		if (it.hasFluffImages || it.fluff?.images) it._fMisc.push("Has Images");
	}

	addToFilters (it, isExcluded) {
		if (isExcluded) return;

		this._sourceFilter.addItem(it.source);
		this._typeFilter.addItem(it.trapHazType);
	}

	async _pPopulateBoxOptions (opts) {
		opts.filters = [
			this._sourceFilter,
			this._typeFilter,
			this._miscFilter,
		];
	}

	toDisplay (values, it) {
		return this._filterBox.toDisplay(
			values,
			it.source,
			it.trapHazType,
			it._fMisc,
		);
	}
}

globalThis.PageFilterTrapsHazards = PageFilterTrapsHazards;

class ListSyntaxTrapsHazards extends ListUiUtil.ListSyntax {
	static _INDEXABLE_PROPS_ENTRIES = [
		"effect",
		"trigger",
		"countermeasures",
		"entries",
	];
}

globalThis.ListSyntaxTrapsHazards = ListSyntaxTrapsHazards;
