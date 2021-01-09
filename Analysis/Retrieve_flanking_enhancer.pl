###################################
# perl Get_yak.pl
# Created Nov 28th 07
# To retrieve sim-mel alignment 
# for flanking regions using wget
# hebin
#! /usr/bin/perl -w
###################################

die "cannot open file" unless
    open(f_Input, "./fasta/enhancer_list.txt");
open f_Output, ">./fasta/enhancer_flanking.fa";
###################
# #of flanking bp
###################
$flanking = 200;

<f_Input>;
do{
    $line = <f_Input>;
    ($region, $chr, $start, $end) = split(/\s+/, $line);
    $start -= $flanking;
    $end += $flanking;
    $chr = 'chr'.$chr;
    $arg1 = '"http://pipeline.lbl.gov/cgi-bin/gp_align?run=94&base=dm2&pos='.$chr.":".$start."-".$end.'&org=160"';
    $arg2 = "-O temp.fa";
    $arg3 = '-o temp';
    if(system("~/Documents/wget-1.10.2/src/wget $arg1 $arg2 $arg3") == 0){
	#process sequences for later work;
	open f_File, "temp.fa";
	<f_File>;<f_File>;<f_File>;<f_File>;<f_File>;<f_File>;<f_File>;
	#mel
	$line = <f_File>;
	if(!eof(f_File)){
	print f_Output "\>$region\_mel\n";
	$seq = '';
	while($line !~ /\>/){
	    chomp $line;
	    chop $line;#remove the additional \cM;
	    $seq .= $line;
	    $line = <f_File>;
	}
	print f_Output $seq, "\n";
	#sim
	print f_Output "\>$region\_sim\n";
	$line = <f_File>;
	$seq = '';
	while(!eof(f_File)){
	    chomp $line;
	    chop $line;
	    $seq .= $line;
	    $line = <f_File>;
	}
	substr($seq, -5) = '';
	print f_Output $seq, "\n";
	print "$region done\n";
    }
	else{
	    print "$region no alignment\n";
	}
    }else{
        die "cannot execute $region";
    }
}while(!eof(f_Input));

