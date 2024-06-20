import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Link } from 'react-router-dom';

const boroughs = [
  "Barking and Dagenham",
  "Barnet",
  "Bexley",
  "Brent",
  "Bromley",
  "Camden",
  "Croydon",
  "Ealing",
  "Enfield",
  "Greenwich",
  "Hackney",
  "Hammersmith and Fulham",
  "Haringey",
  "Harrow",
  "Havering",
  "Hillingdon",
  "Hounslow",
  "Islington",
  "Kensington and Chelsea",
  "Kingston upon Thames",
  "Lambeth",
  "Lewisham",
  "Merton",
  "Newham",
  "Redbridge",
  "Richmond upon Thames",
  "Southwark",
  "Sutton",
  "Tower Hamlets",
  "Waltham Forest",
  "Wandsworth",
  "Westminster",
]

const Home = () => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <div className="w-screen">
      <Card className="flex flex-col justify-center mx-auto max-w-sm p-8 mt-4 self-center w-[90%] max-w-[1000px]">
        <CardTitle className="mx-auto">
          Welcome to CouncilHelper
        </CardTitle>
        <CardContent className="flex flex-col gap-8 mt-8">
          <div className="mx-auto">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {value
                    ? boroughs.find((borough) => borough === value) || "Select borough..."
                    : "Select borough..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Type a command or search..." />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                      {boroughs.map((borough) => (
                        <CommandItem
                          key={borough}
                          value={borough}
                          onSelect={(currentValue) => {
                            setValue(currentValue === value ? "" : currentValue)
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === borough ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {borough}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          {value && 
            <div className="flex flex-col gap-8 w-[50%]">
              <h1 className="text-2xl font-bold">
                {value} Services
              </h1>
              {value === "Hammersmith and Fulham" && 
                <Link to="/form"><Button>Council Tax Exemption</Button></Link>
              }
              <Link to="book-call"><Button>Book Call</Button></Link>
            </div>
          }
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
