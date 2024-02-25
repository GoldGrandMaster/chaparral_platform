import { Button } from '@/common/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Input } from '@/common/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/common/components/ui/select';
import config from '@/config';
import { SelectValue } from '@radix-ui/react-select';
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from "@/common/components/ui/use-toast"
const SearchPageForm = () => {
    const [curProject, setCurProject] = useState<any>();
    const [paramDlgOpen, setParamDlgOpen] = useState(false);
    const token = localStorage.getItem('token');
    const { toast } = useToast();
    const handleSubmit = (e: any) => {
        const form = e.target;
        e.preventDefault();
        const data = {
            database: {
                bucket_size: form.bucket_size.value,
                fasta: "fasta.fasta",
                enzyme: {
                    missed_cleavages: +form.missed_cleavages.value,
                    min_len: +form.min_len.value,
                    max_len: +form.max_len.value,
                    cleave_at: form.cleave_at.value,
                    restrict: form.restrict.value,
                    c_terminal: form.c_terminal.checked
                },
                variable_mods: {
                    [form.variable_mods_name.value]: +form.variable_mods_val.value
                },
                static_mods: {
                    [form.static_mods_name.value]: +form.static_mods_val.value
                }
            },
            precursor_tol: {
                kind: form.pre_kind.value,
                low: +form.pre_low.value,
                high: +form.pre_high.value
            },
            fragment_tol: {
                kind: form.frag_kind.value,
                low: +form.frag_low.value,
                high: +form.frag_high.value
            },
            isotope_errors: [+form.isotope_errors0.value, +form.isotope_errors1.value],
            quant: {
                // tmt: "Tmt10" | "Tmt11" | "Tmt16" | "Tmt18" | null,
                tmt: form.tmt.value,
                tmt_settings: {
                    sn: form.sn.checked,
                    level: +form.tmt_level.value,
                },
                lfq: form.lfq.checked
            },
            deisotope: form.deisotope.checked,
            chimera: form.chimera.checked,
            predict_rt: form.predict_rt.checked,
            wide_window: form.wide_window.checked,
            min_peaks: +form.min_peaks.value,
            max_peaks: +form.max_peaks.value,
            min_matched_peaks: +form.min_matched_peaks.value,
            max_fragment_charge: +form.max_fragment_charge.value,
            report_psms: +form.report_psms.value,
            mzml_paths: [
                "PXD003881/B03_02_150304_human_ecoli_B_3ul_3um_column_95_HCD_OT_2hrs_30B_9B.mzML.gz",
                "PXD003881/B03_03_150304_human_ecoli_C_3ul_3um_column_95_HCD_OT_2hrs_30B_9B.mzML.gz"
            ]
        };
        fetch(config.backend_url + 'search', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data),
        })
            .then((res: Response) => {
                if (!res.ok) return res.json();
                return res.text();
            })
            .then((msg: any) => {
                if (msg == "true")
                    toast({
                        description: "Searching...",
                        variant: 'success'
                    });
            })
            .catch(error => {
                console.error("Error:", error);
                toast({
                    description: "An error occurred while communicating with the server",
                    variant: 'error'
                });
            });
    };
    useEffect(() => {
        const curProj = JSON.parse(localStorage.getItem('currentProject') || "");
        setCurProject(curProj);
    }, [])
    return (
        <>
            <div className='flex w-full h-full flex-col'>
                <div className='flex w-full items-center justify-between'>
                    <div className='flex-col gap-3 h-full'>
                        <p style={{ fontSize: "30px" }}>{curProject && curProject.name}</p>
                        <h1>{curProject && curProject.description}</h1>
                    </div>
                    <Button
                        onClick={() => setParamDlgOpen(true)}>Run Search</Button>
                </div>
                <p className='mt-[10px]'>Search Result</p>
                <p>Files</p>
            </div>
            <Dialog
                open={paramDlgOpen}
                onOpenChange={setParamDlgOpen}
                modal={false} >
                <DialogContent>
                    <DialogTitle>
                        Set search parameters
                    </DialogTitle>
                    <form onSubmit={handleSubmit}>
                        <div className='flex flex-col gap-3 items-center'>
                            <div className='flex flex-col gap-y-3'>
                                <Input required type='number' placeholder='Bucket size' name='bucket_size' className='w-20' />
                                <div>
                                    <p>Variable Mods</p>
                                    <div className='flex flex-row gap-3 items-center mt-1'>
                                        <Input required placeholder='var_mod_name' name='variable_mods_name' className='w-20' />
                                        <Input required type='number' placeholder='var_mod_val' name='variable_mods_val' className='w-20' />
                                    </div>
                                </div>
                                <div>
                                    <p>Static Mods</p>
                                    <div className='flex flex-row gap-3 items-center mt-1'>
                                        <Input required placeholder='static_mod_name' name='static_mods_name' className='w-20' />
                                        <Input required type='number' placeholder='static_mod_val' name='static_mods_val' className='w-20' />
                                    </div>
                                </div>
                                <div>
                                    <p>Enzymatic Digest</p>
                                    <div className='flex flex-row gap-3 items-center mt-1'>
                                        <Input required type='text' placeholder='Cleave At' name='cleave_at' className='w-20' />
                                        <Input required type='text' placeholder='Restrict' name='restrict' className='w-20' />
                                        <Input required type='number' placeholder='Min Length' name='min_len' className='w-20' />
                                        <Input required type='number' placeholder='Max Length' name='max_len' className='w-20' />
                                        <Input required type='number' placeholder='Missed' name='missed_cleavages' className='w-20' />
                                        <div className='flex flex-row items-center gap-1'>
                                            <Input type='checkbox' name='c_terminal' />
                                            <p>Cterminal specific</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p>Precursor Tolerance</p>
                                    <div className='flex flex-row gap-3 items-center mt-1'>
                                        <Input required type='number' placeholder='Low' name='pre_low' className='w-20' />
                                        <Input required type='number' placeholder='High' name='pre_high' className='w-20' />
                                        <Select required defaultValue='ppm' name='pre_kind'>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent defaultValue='ppm'>
                                                <SelectItem value='ppm'>
                                                    ppm
                                                </SelectItem>
                                                <SelectItem value='da'>
                                                    da
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <p>Fragment Tolerance</p>
                                    <div className='flex flex-row gap-3 items-center mt-1'>
                                        <Input required type='number' placeholder='Low' name='frag_low' className='w-20' />
                                        <Input required type='number' placeholder='High' name='frag_high' className='w-20' />
                                        <Select required defaultValue='ppm' name='frag_kind'>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='ppm'>
                                                    ppm
                                                </SelectItem>
                                                <SelectItem value='da'>
                                                    da
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <p>Isobaric quant</p>
                                    <div className='flex flex-row gap-3 items-center mt-1'>
                                        <Select required defaultValue='Tmt10' name='tmt'>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='Tmt10'>
                                                    Tmt10
                                                </SelectItem>
                                                <SelectItem value='Tmt11'>
                                                    Tmt11
                                                </SelectItem>
                                                <SelectItem value='Tmt16'>
                                                    Tmt16
                                                </SelectItem>
                                                <SelectItem value='Tmt18'>
                                                    Tmt18
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input type='number' placeholder='Level' name='tmt_level' className='w-20' />
                                        <div className='flex flex-row items-center gap-1'>
                                            <Input type='checkbox' name='sn' />
                                            <p>S/N</p>
                                        </div>
                                        <div className='flex flex-row items-center gap-1'>
                                            <Input type='checkbox' name='lfq' />
                                            <p>LFQ</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p>Isotope errors</p>
                                    <div className='flex flex-row gap-3 items-center mt-1'>
                                        <Input required type='number' placeholder='err' name='isotope_errors0' className='w-20' />
                                        <Input required type='number' placeholder='err' name='isotope_errors1' className='w-20' />
                                    </div>
                                </div>
                                <div className='flex flex-row gap-3'>
                                    <div className='flex flex-row items-center gap-1'>
                                        <Input type='checkbox' name='deisotope' />
                                        <p>Deisotope</p>
                                    </div>
                                    <div className='flex flex-row items-center gap-1'>
                                        <Input type='checkbox' name='chimera' />
                                        <p>Chimera</p>
                                    </div>
                                    <div className='flex flex-row items-center gap-1'>
                                        <Input type='checkbox' name='predict_rt' />
                                        <p>Predict_rt</p>
                                    </div>
                                    <div className='flex flex-row items-center gap-1'>
                                        <Input type='checkbox' name='wide_window' />
                                        <p>Wide_window</p>
                                    </div>
                                </div>
                                <div className='flex flex-row gap-3'>
                                    <Input required type='number' placeholder='Min peaks' name='min_peaks' className='w-20' />
                                    <Input required type='number' placeholder='Max peaks' name='max_peaks' className='w-20' />
                                    <Input required type='number' placeholder='Min matched peaks' name='min_matched_peaks' className='w-20' />
                                    <Input required type='number' placeholder='Max fragment charge' name='max_fragment_charge' className='w-20' />
                                    <Input required type='number' placeholder='Report psms' name='report_psms' className='w-20' />
                                </div>
                            </div>
                            <Button type='submit'>Submit</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default SearchPageForm;