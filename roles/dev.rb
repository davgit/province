name "dev"
description "chef role for development environment"
run_list "recipe[npm]", "recipe[git]" , "recipe[dev]"