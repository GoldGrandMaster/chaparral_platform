import React, { useState } from 'react'
import { Button } from '@/common/components/ui/button'
import { Label } from '@/common/components/ui/label'
import { Input } from "@/common/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card'
import { ToggleGroup, ToggleGroupItem } from "@/common/components/ui/toggle-group"
import { ToggleGroup as ToggleGroup4, ToggleGroupItem as ToggleGroupItem4 } from "@/common/components/ui/toggle-group-4"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/ui/table"

import { Popover } from '@/common/components/ui/popover'
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { Modification } from './types'
import { Alert, AlertDescription, AlertTitle } from "@/common/components/ui/alert"



interface ModificationTargetProps {
  value: string[],
  onChange: (value: string[]) => void;
}

function ModificationTargetComponent(props: ModificationTargetProps) {
  const VALID_AA = [
    'A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S',
    'T', 'V', 'W', 'Y', 'U', 'O', '[', ']', '^', '$'
  ];


  return (
    <ToggleGroup4 type="multiple" variant="outline" orientation='vertical' value={props.value} onValueChange={props.onChange}>
      {VALID_AA.map((label) => {
        return <ToggleGroupItem4 key={label} value={label}>{label}</ToggleGroupItem4>
      })}
    </ToggleGroup4>
  )
}

export interface ModificationProps {
  value: Modification[],
  onChange: (value: Modification[]) => void,
}

export function ModificationUI(props: ModificationProps) {

  function add_row() {
    const new_mod: Modification = {
      label: "Custom",
      target: [],
      value: 0,
      kind: "off",
    };

    props.onChange([...props.value, new_mod]);
  }


  function render_label(index: number) {
    const mod = props.value[index];
    if (mod.unimod) {
      return <Label>{mod.label}</Label>
    } else {
      return <Input value={mod.label} className="w-3/4"
        onChange={(ev) => {
          let mods = props.value.map((val, idx) => {
            if (idx == index) {
              return {
                ...val,
                label: ev.target.value
              }
            } else {
              return val;
            }
          });
          props.onChange(mods);
        }}
      />
    }
  }

  function render_value(index: number) {
    const mod = props.value[index];
    if (mod.unimod) {
      return <Label>{mod.value}</Label>
    } else {
      return <Input value={mod.value} className="w-3/4" type="number"
        onChange={(ev) => {
          let mods = props.value.map((val, idx) => {
            if (idx == index) {
              return {
                ...val,
                value: ev.target.valueAsNumber,
              }
            } else {
              return val;
            }
          });
          props.onChange(mods);
        }}
      />
    }
  }




  function render_targets(index: number) {
    const mod = props.value[index];
    if (mod.unimod) {
      return mod.target.join(", ")
    }
    return <span className="flex items-center space-x-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="default"> Edit</Button>
        </PopoverTrigger>
        <PopoverContent>
          <Card className="w-[300px]">
            <CardHeader>
              <CardTitle>
                Select target residues
              </CardTitle>
              <CardDescription>
                Select residues (or termini) to apply this modification to
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ModificationTargetComponent value={mod.target}
                onChange={(target) => {
                  let mods = props.value.map((value, idx) => {

                    if (idx == index) {

                      return {
                        ...value,
                        target: target
                      };
                    } else {
                      return value;
                    }
                  });
                  props.onChange(mods);

                }} />
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </span>
  }

  function validate() {
    let map: Map<string, string[]> = new Map();
    props.value.filter((m) => m.kind == 'static').forEach((m) => {
      for (const t of m.target) {
        if (map.has(t)) {
          map.set(t, [...map.get(t)!, m.label]);
        } else {
          map.set(t, [m.label]);
        }
      }
    });

    let alerts = []
    for (const [k, v] of map.entries()) {
      if (v.length > 1) {
        alerts.push((
          <div>
            The following static modifications target `{k}`: {v.join(', ')}
          </div>
        ))
      }
    }

    if (alerts.length > 0) {
      return <Alert variant="destructive" className="my-4">
        <AlertTitle>Conflicting static modifications!</AlertTitle>
        <AlertDescription>
          {alerts}
        </AlertDescription>
      </Alert>
    } else {
      return <> </>
    }

  }

  return (
    <div>

      {validate()}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Modification</TableHead>
            <TableHead>Target Residue(s)</TableHead>
            <TableHead>Monoisotopic Mass</TableHead>
            <TableHead>Modification Kind</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>

          {props.value.map((x, i) => (
            <TableRow key={i}>
              <TableCell>
                {render_label(i)}
              </TableCell>
              <TableCell>
                {render_targets(i)}
              </TableCell>
              <TableCell>
                {render_value(i)}
              </TableCell>
              <TableCell>
                <ToggleGroup
                  type="single"
                  variant={"outline"}
                  className="justify-start"
                  onValueChange={(ev) => {
                    let mods = props.value.map((val, idx) => {
                      if (idx == i) {
                        return {
                          ...val,
                          kind: ev as "off" | "static" | "variable",
                        };
                      }
                      return val;
                    });
                    props.onChange(mods);
                  }}
                  value={x.kind}
                  defaultValue='off'
                  disabled={x.target.length == 0}
                >
                  <ToggleGroupItem value="off" aria-label="Toggle variable">
                    Off
                  </ToggleGroupItem>
                  <ToggleGroupItem value="variable" aria-label="Toggle variable">
                    Variable
                  </ToggleGroupItem>
                  <ToggleGroupItem value="static" aria-label="Toggle static">
                    Static
                  </ToggleGroupItem>
                </ToggleGroup>
              </TableCell>
            </TableRow>
          ))}

        </TableBody>
      </Table>

      <Button onClick={add_row}>Add custom modification</Button>
    </div>
  )
}

