return {
    'dense-analysis/ale',
    config = function()
        -- Configuration goes here.
        local g = vim.g
	g.netrw_liststyle = 3
	g.netrw_banner = 0
	g.netrw_browse_split = 2
	g.netrw_wiw = 20

        g.ale_ruby_rubocop_auto_correct_all = 1
	g.ale_fix_on_save = 1
	g.ale_fixers = {
		javascript = { "eslint", "prettier" },
		typescript = { "eslint", "prettier" },
		javascriptreact= {'prettier', 'eslint'},
		typescriptreact= {'prettier', 'eslint'},
		python= {"autopep8"}
	}
        g.ale_linters = {
		ruby = {'rubocop', 'ruby'},
		lua = {'lua_language_server'},
		javascript = {"eslint", "prettier"},
		typescript = {"eslint", "prettier"},
		javascriptreact= {'prettier', 'eslint'},
		typescriptreact= {'prettier', 'eslint'},
		python = {"autopep8"}
        }
    end
}
