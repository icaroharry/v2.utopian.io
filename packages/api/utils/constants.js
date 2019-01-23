const Joi = require('joi')

const licenses = ['afl-3.0', 'apache-2.0', 'artistic-2.0', 'bs1-1.0', 'bsd-2-clause', 'bsd-3-clause', 'bsd-3-clause-clear', 'cc', 'cc0-1.0', 'cc-by-4.0', 'cc-by-sa-4.0', 'wtfpl', 'ecl-2.0', 'epl-1.0', 'eupl-1.1', 'agpl-3.0', 'gpl', 'gpl-2.0', 'gpl-3.0', 'lgpl', 'lgpl-2.1', 'lgpl-3.0', 'isc', 'lppl-1.3c', 'ms-pl', 'mit', 'mpl-2.0', 'osl-3.0', 'postgresql', 'ofl-1.1', 'ncsa', 'unlicense', 'zlib']

const languages = ['abk', 'aar', 'afr', 'aka', 'sqi', 'amh', 'ara', 'arg', 'hye', 'asm', 'ava', 'ave', 'aym', 'aze', 'bam', 'bak', 'eus', 'bel', 'ben', 'bih', 'bis', 'bos', 'bre', 'bul', 'mya', 'cat', 'cha', 'che', 'nya', 'zho', 'chv', 'cor', 'cos', 'cre', 'hrv', 'ces', 'dan', 'div', 'nld', 'dzo', 'eng', 'epo', 'est', 'ewe', 'fao', 'fij', 'fin', 'fra', 'ful', 'glg', 'kat', 'deu', 'ell', 'grn', 'guj', 'hat', 'hau', 'heb', 'her', 'hin', 'hmo', 'hun', 'ina', 'ind', 'ile', 'gle', 'ibo', 'ipk', 'ido', 'isl', 'ita', 'iku', 'jpn', 'jav', 'kal', 'kan', 'kau', 'kas', 'kaz', 'khm', 'kik', 'kin', 'kir', 'kom', 'kon', 'kor', 'kur', 'kua', 'lat', 'ltz', 'lug', 'lim', 'lin', 'lao', 'lit', 'lub', 'lav', 'glv', 'mkd', 'mlg', 'msa', 'mal', 'mlt', 'mri', 'mar', 'mah', 'mon', 'nau', 'nav', 'nde', 'nep', 'ndo', 'nob', 'nno', 'nor', 'iii', 'nbl', 'oci', 'oji', 'chu', 'orm', 'ori', 'oss', 'pan', 'pli', 'fas', 'pol', 'pus', 'por', 'que', 'roh', 'run', 'ron', 'rus', 'san', 'srd', 'snd', 'sme', 'smo', 'sag', 'srp', 'gla', 'sna', 'sin', 'slk', 'slv', 'som', 'sot', 'spa', 'sun', 'swa', 'ssw', 'swe', 'tam', 'tel', 'tgk', 'tha', 'tir', 'bod', 'tuk', 'tgl', 'tsn', 'ton', 'tur', 'tso', 'tat', 'twi', 'tah', 'uig', 'ukr', 'urd', 'uzb', 'ven', 'vie', 'vol', 'wln', 'cym', 'wol', 'fry', 'xho', 'yid', 'yor', 'zha', 'zul']

const validation = {
  articleTag: /^[a-z0-9-+.#]*$/,
  id: Joi.string().trim().lowercase().regex(/^[a-f\d]{24}$/),
  username: Joi.string().trim().lowercase().required().min(3).max(32).regex(/^[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*$/)
}

module.exports = {
  licenses,
  validation,
  languages
}
