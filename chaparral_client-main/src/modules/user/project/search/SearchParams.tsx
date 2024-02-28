import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/common/components/ui/tabs"
import { ToleranceUI } from "./Tolerance"
import { QuantificationUI } from './Quantification'
import { ModificationUI } from './Modifications'
import { DatabaseUI } from "./Database"
import { Button } from '@/common/components/ui/button'
import { DefaultParams, Params, SageParams, Tolerance } from './types'

export interface Props {
  // Callback - parent of this component needs to submit to server
  onSubmit: (value: SageParams) => void;
}
export function CustomCardContent(props: any) {
  return (
    <CardContent className='h-[calc(90vh-240px)] overflow-auto'>
      {props.children}
    </CardContent>
  )
}

export function SearchParams(props: Props) {
  const [params, setParams] = useState(DefaultParams);
  const [openSearch, setOpenSearch] = useState(false);
  const [curProject, setCurProject] = useState<any>();
  const [enzyme, setEnzyme] = useState("Trypsin");
  const [applyClosed, setApplyClosed] = useState("Default closed search (High-res MS2)");

  const token = localStorage.getItem('token');
  /// Convert to actual parameter schema that will be sent to the server

  useEffect(() => {
    const curProj = JSON.parse(localStorage.getItem('currentProject') || "");
    setCurProject(curProj);
  }, [])
  function convert(params: Params<Tolerance>): SageParams {
    let static_mods: { [aa: string]: number[] } = {};
    let variable_mods: { [aa: string]: number[] } = {};
    for (const mod of params.database.modifications) {
      switch (mod.kind) {
        case "off": { continue; }
        case "static": {
          for (const tgt of mod.target) {
            if (tgt in static_mods) {
              static_mods[tgt].push(mod.value);
            } else {
              static_mods[tgt] = [mod.value];
            }
          }
          break;
        }
        case "variable": {
          for (const tgt of mod.target) {
            if (tgt in variable_mods) {
              variable_mods[tgt].push(mod.value);
            } else {
              variable_mods[tgt] = [mod.value];
            }
          }
          break;
        }

      }
    }
    return {
      ...params,
      database: {
        bucket_size: 8192,
        enzyme: params.database.enzyme,
        fasta: params.database.fasta,
        static_mods,
        variable_mods,
      },
      precursor_tol: {
        // switch upper and lower to make more sense to most users
        [params.precursor_tol.kind]: [params.precursor_tol.upper, params.precursor_tol.lower]
      },
      fragment_tol: {
        [params.fragment_tol.kind]: [params.fragment_tol.upper, params.fragment_tol.lower]
      },
      mzml_paths: [
        "PXD003881/B03_02_150304_human_ecoli_B_3ul_3um_column_95_HCD_OT_2hrs_30B_9B.mzML.gz",
        "PXD003881/B03_03_150304_human_ecoli_C_3ul_3um_column_95_HCD_OT_2hrs_30B_9B.mzML.gz",
      ]
    }
  }
  function submit() {
    props.onSubmit(convert(params));
  }

  return (
    <div>
      <div className='flex w-full h-full flex-col'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex-col gap-3 h-full'>
            <p style={{ fontSize: "30px" }}>{curProject && curProject.name}</p>
            <h1>{curProject && curProject.description}</h1>
          </div>
          <Button
            variant='outline'
            onClick={() => setOpenSearch(true)}>Run Search</Button>
        </div>
        <p className='mt-[10px]'>Search Result</p>
        <p>Files</p>
      </div>
      <Dialog
        open={openSearch}
        onOpenChange={setOpenSearch}
        modal={true} >
        <DialogContent
          className='max-w-[100%] h-[90vh]'
        >
          <DialogHeader>
            <DialogTitle>
              Set search parameters
            </DialogTitle>
            <br />
            <Tabs defaultValue='fasta'>
              <TabsList>
                <TabsTrigger value='fasta'>Database</TabsTrigger>
                <TabsTrigger value='modifications'>Modifications</TabsTrigger>
                <TabsTrigger value='tolerances'>Tolerances</TabsTrigger>
                <TabsTrigger value='quant'>Quantification</TabsTrigger>
                <TabsTrigger value='review'>Review & Submit</TabsTrigger>
              </TabsList>
              <TabsContent value='fasta'>
                <Card>
                  <CardHeader>
                    <CardTitle>Database & Enzyme</CardTitle>
                    <CardDescription>Configure FASTA file and protein digestion</CardDescription>
                  </CardHeader>
                  <CustomCardContent>
                    <DatabaseUI
                      enzyme={enzyme}
                      setEnzyme={setEnzyme}
                      value={params.database}
                      onChange={(v) => setParams({ ...params, database: v })} />
                  </CustomCardContent>
                </Card>
              </TabsContent>
              <TabsContent value='modifications'>
                <Card>
                  <CardHeader>
                    <CardTitle>Modifications</CardTitle>
                    <CardDescription>Configure static and variable modifications</CardDescription>
                  </CardHeader>
                  <CustomCardContent>
                    <ModificationUI value={params.database.modifications} onChange={(v) => {
                      setParams({ ...params, database: { ...params.database, modifications: v } })
                    }} />
                  </CustomCardContent>
                </Card>
              </TabsContent>
              <TabsContent value='tolerances'>
                <Card>
                  <CardHeader>
                    <CardTitle>Tolerance</CardTitle>
                    <CardDescription>Configure search tolerances</CardDescription>
                  </CardHeader>
                  <CustomCardContent>
                    <ToleranceUI
                      applyClosed={applyClosed}
                      setApplyClosed={setApplyClosed}
                      value={{ ...params }}
                      onChange={(val) => setParams({ ...params, ...val })} />
                  </CustomCardContent>
                </Card>
              </TabsContent>
              <TabsContent value='quant'>
                <Card>
                  <CardHeader>
                    <CardTitle>Quantification</CardTitle>
                    <CardDescription>Configure quantification</CardDescription>
                  </CardHeader>
                  <CustomCardContent>
                    <QuantificationUI value={params.quant} onChange={(val) => setParams({ ...params, quant: val })} />
                  </CustomCardContent>
                </Card>
              </TabsContent>
              <TabsContent value='review'>
                <Card>
                  <CardHeader>
                    <CardTitle>Review & Submit</CardTitle>
                    <CardDescription>Check search parameters and submit to job queue</CardDescription>
                  </CardHeader>
                  <CustomCardContent>
                    <div className="flex items-center space-x-2">
                      <Button className="my-4" variant="default" onClick={submit}>Submit</Button>
                      <Button className="my-4" variant="destructive" onClick={(_) => setParams(DefaultParams)}>Reset to defaults</Button>
                    </div>
                    <pre>
                      <code>
                        {JSON.stringify(convert(params), undefined, 2)}
                      </code>
                    </pre>
                  </CustomCardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogHeader>
        </DialogContent>
      </Dialog >
    </div>
  )
}
