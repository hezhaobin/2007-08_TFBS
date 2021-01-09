##############################
#! /usr/bin/perl -w
#  Created Aug 30th 2007
#  To predict the best match
#  to pwm in mel and sim
#  Hebin
##############################


use DBI;
prepareDbh();
#$dbh->do(qq{truncate table tfbs_poly});
#die "Cannot open filename\n" unless open (f_File, "filename");
$flank = 5;

####################
# Pick up a region #
####################
while(1){
    print "Region(q to quit): CE";
    $region = <STDIN>;
    chop $region;
    next if ($region eq '');
    last if ($region eq 'q');
    $region = "CE".$region;
    $filename = `grep "$region" filename`;
    chop $filename if (substr($filename, -1, 1) eq "\n");
    ($region_start, $region_end) = (split(/\.|\-/, $filename))[2,3];
    if(open(f_Input, $filename)){
	$desc = `grep "$region" regions_annotation.txt`;
	$desc =~ tr/\t/\n/;
	print "Summary\n--------\n$desc--------\n";
    }else{
	print "cannnot open file $filename";
	next;
    }




    ####################
    # Retrieve all the 
    # binding sites
    # location
    ####################
    $sth = $dbh -> prepare(qq(select e.region as region, t.* 
			      from enhancer as e, tfbs as t 
			      where e.region = '$region' AND t.chr_arm = e.chr_arm AND t.tfbs_start between e.start and e.end order by t.tfbs_id));
    $sth -> execute();
    @species = ('mel', 'c1674', 'md106', 'md199', 'newc', 'sim46', 'w501');
    (@array) = ();
    while(@array = $sth -> fetchrow_array()){
	$patser_seq = '';
	$align_seq = '';
	($region,$tfbs_id, $chr_arm, $factor, $target, $fp_start, $fp_end) = @array[0..6];
	print $factor,"\n\t1   5    10   15   20 \n";
	if(($fp_start-$region_start) >= $flank){#get the footprinted sites with 5bp flanking;
	    $start = $fp_start-$region_start-$flank;
	    $prefix = $flank;
	}else{
	    $start = 0;
	    $prefix = $fp_start - $region_start;
	}
	if(($region_end - $fp_end) >= $flank){
	    $span = $fp_end -$fp_start +1 +$flank;
	    $suffix = $flank;
	}else{
	    $span = $region_end - $fp_start + 1;
	    $suffix = $region_end - $fp_end;
	}
	seek(f_Input, 0, 0);
	for($i = 0; $i < 6; $i ++){
	    $line = <f_Input>;
	    $line = <f_Input>;#get the sequence;
	    #$seq{$species[$i]} = substr($line, $start, $span);
	    $seq{$species[$i]} = lc(substr($line, $fp_start-$region_start-$prefix, $prefix)).
		                 substr($line, $fp_start-$region_start, $fp_end-$fp_start+1).
		                 lc(substr($line, $fp_end-$region_start+1, $suffix));
	    if($seq{$species[$i]} =~ /N|n/){
		next;
	    }
	    $patser_seq = $patser_seq.$species[$i]."\t\\".$seq{$species[$i]}."\\\n";
	    if(0){
	    }
	}
	$result = `echo -n '$patser_seq' | 
                   ~/Documents/tfbs/patser/patser-v3b -A a:t 0.3 c:g 0.2 -m ~/Documents/tfbs/OptimalPatserMatrices/$factor -b 1 -d2 -c -t |
                   grep "width of the alignment matrix:\\|position="`;
	$result =~ /width of the alignment matrix:\s+(\d+)/;
	$width = $1;
	@position = $result =~ /position=\s+(\d+C?)\s+/g;
	$k = 0;#the index for @position;
	for($i = 0; $i < 6; $i ++){
	    if($seq{$species[$i]} =~ /n|N/){next;}
	    if($i == 0){
		$align_seq = $species[$i]."\t".$seq{$species[$i]}."\n";
	    }else{
		$align_seq = $align_seq.$species[$i]."\t".align($seq{$species[$i]})."\n";
	    }
	    #mark the location of the binding sites
	    if($result =~ /$species[$i]/){
		if($position[$k] !~ /C/){
		    $tfbs_start = $position[$k];
		}else{
		    $position[$k] =~ tr/C//d;
		    $tfbs_start = length($seq{'mel'}) - $position[$k] - $width + 2;
		}
		$align_seq .= "\t";
		for($j = 1; $j < $tfbs_start; $j ++){
		    $align_seq .= " ";
		}
		for($j = 0; $j < $width; $j ++){
		    $align_seq .= "^";
		}
		$align_seq .= "\n";
		$k ++;
	    }
	    #end marking;
	}
	print $align_seq;
	print $result;
	$sign = <STDIN>;
	chop $sign;
	if($sign eq 'q'){last;};
    }
    
    $sth -> finish();
}
$dbh -> disconnect;

sub prepareDbh
{
    my $username = "hebin";
    my $password = "fruitfly";
    my $database = "hebin";

    my $dsn = "DBI:mysql:$database:localhost";
    our $dbh = DBI->connect($dsn,$username,$password);
}
sub align
{
    my $seq = shift;
    my (@seq) = split(//, $seq);
    my (@ref) = split(//, $seq{'mel'});
    my $length = length($seq);
    my $i = 0;
    for($i = 0; $i < $length; $i ++){
	if($seq[$i] eq $ref[$i]){
	    $seq[$i] = '.';
	}
    }
    return join("", @seq);
}
