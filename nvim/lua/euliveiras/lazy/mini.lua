return { 
	'nvim-mini/mini.nvim',
	version = false,
	config = function()
	require('mini.animate').setup()
	require('mini.icons').setup()
end
}
