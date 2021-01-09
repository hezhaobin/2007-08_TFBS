###################################
# perl Get_yak.pl
# Created Nov 28th 07
# To retrieve yak-mel alignment 
# for defined regions using wget
# hebin
#! /usr/bin/perl -w
###################################

die "cannot open file" unless
    open(f_Input, "regions.txt");

$line = <f_Input>;
while(!eof(f_Input)){
    ($chr, $start, $end, $region) = split(/\s+/, $line);
    $arg1 = '"http://pipeline.lbl.gov/cgi-bin/gp_align?run=87&base=dm2&pos='.$chr.":".$start."-".$end.'&org=43"';
    $arg2 = "-O $region\.fa";
    $arg3 = '-o temp';
    if(system("~/Documents/#LAB/wget-1.10.2/src/wget $arg1 $arg2 $arg3") == 0){
	print $region, "\t";
    }else{
	die "cannot execute $region";
    }
    $line = <f_Input>;
}
